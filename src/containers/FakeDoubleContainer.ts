import { Block } from "bdsx/bds/block";
import { ContainerType, ItemStack, NetworkItemStackDescriptor } from "bdsx/bds/inventory";
import { ServerPlayer } from "bdsx/bds/player";
import {
    BlockActorDataPacket,
    ContainerClosePacket,
    ContainerOpenPacket,
    InventorySlotPacket,
    ItemStackRequestActionTransferBase,
    UpdateBlockPacket
} from "bdsx/bds/packets";
import { BlockPos } from "bdsx/bds/blockpos";
import { bedrockServer } from "bdsx/launcher";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { PlayerManager } from "../PlayerManager";
import { Utils } from "../utils/Utils";
import { CANCEL } from "bdsx/common";
import { ByteTag, IntTag, StringTag, Tag } from "bdsx/bds/nbt";
import { ContainerInventory, ContainerSize } from "../ContainerMenu";

type TransactionCallback = (action: ItemStackRequestActionTransferBase) => void | CANCEL;
type ContainerCloseCallback = () => void;

export class FakeDoubleContainer {
    private netId: NetworkIdentifier;
    private containerId: number;
    private position: BlockPos;
    private position2: BlockPos;
    private block: Block;
    private containerType: ContainerType;
    private containerSize: ContainerSize;
    private inventory: ContainerInventory;
    private customName: string;

    private transactionCallback: TransactionCallback;
    private containerCloseCallback: ContainerCloseCallback;

    constructor(block: Block, containerType: ContainerType, containerSize: number, player: ServerPlayer, inventory?: ContainerInventory) {
        this.netId = player.getNetworkIdentifier();
        this.containerId = player.nextContainerCounter();
        this.block = block;
        this.containerType = containerType;
        this.containerSize = containerSize;
        this.inventory = inventory || {};
    }


    private placeContainer(pos: BlockPos): void {
        const pk = UpdateBlockPacket.allocate();
        pk.blockPos.construct(pos);
        pk.dataLayerId = 0;
        pk.flags = UpdateBlockPacket.Flags.Network;
        pk.blockRuntimeId = this.block.getRuntimeId();
        pk.sendTo(this.netId);
        pk.dispose();
    }

    /**
     * Places the containers client-side.
     * This is required in Bedrock edition.
     */
    private placeContainers(): void {
        this.placeContainer(this.position);
        this.placeContainer(this.position2);
    }

    /**
     * Opens the container client-side.
     */
    private openContainer(): void {
        const pk = ContainerOpenPacket.allocate();
        pk.containerId = this.containerId;
        pk.type = this.containerType;
        pk.pos.construct(this.position);
        pk.sendTo(this.netId);
        pk.dispose();
    }

    /**
     * Force-closes the container client-side.
     *
     * @remarks This will destruct the container
     */
    public closeContainer(): void {
        const pk = ContainerClosePacket.allocate();
        pk.containerId = this.containerId;
        pk.server = true;
        pk.sendTo(this.netId);
        pk.dispose();
    }

    /**
     * Sends the fake container to the client.
     */
    public sendToPlayer(): void {
        PlayerManager.setContainer(this.netId, this);
        this.position = Utils.getAbovePosition(this.netId);
        this.position2 = BlockPos.create(this.position.x+1, this.position.y, this.position.z);
        this.placeContainers();
        this.sendNbtData(1);
        this.sendNbtData(0);
        bedrockServer.serverInstance.nextTick().then(() => {
            this.openContainer();
            this.updateAllItems();
        });
    }

    /**
     * Sets an item in the container.
     *
     * @param slot - The slot to set the item in.
     * @param item - The item to set.
     *
     * @remarks This will update the item client-side if needed to.
     */
    public setItem(slot: number, item: ItemStack): void {
        if(slot < 0 || slot >= this.containerSize) {
            throw new Error(`Slot ${slot} is out of range (container has ${this.containerSize} slots)`);
        }
        if (this.inventory[slot] !== undefined && !this.inventory[slot]?.sameItem(item)) this.inventory[slot].destruct();
        this.inventory[slot] = item;
        // If the container is not sent yet, no need to update the slot.
        if(PlayerManager.hasContainer(this.netId)) {
            this.updateItem(slot, item);
        }
    }

    /**
     * Sets the container's inventory contents.
     *
     * @param contents - The contents to set.
     */
    public setContents(contents: ContainerInventory): void {
        for(const [slot, item] of Object.entries(contents)) {
            this.setItem(+slot, item);
        }
    }

    /**
     * Adds an item to the container
     *
     * @param item - The item to add.
     */
    public addItem(item: ItemStack): void {
        for(let i = 0; i < this.containerSize; i++) {
            if(!this.inventory[i]) {
                this.setItem(i, item);
                return;
            }
        }
    }

    /**
     * Updates a single item in the container's inventory client-side.
     */
    private updateItem(slot: number, item: ItemStack): void {
        if(slot < 0 || slot >= this.containerSize) {
            throw new Error(`Slot ${slot} is out of range (container has ${this.containerSize} slots)`);
        }
        const pk = InventorySlotPacket.allocate();
        pk.containerId = this.containerId;
        pk.slot = slot;
        const descriptor = NetworkItemStackDescriptor.constructWith(item);
        pk.descriptor.construct(descriptor);
        pk.sendTo(this.netId);
        descriptor.destruct();
        pk.dispose();
    }

    /**
     * Updates the container's inventory client-side.
     */
    private updateAllItems(): void {
        for (let [slot, item] of Object.entries(this.inventory)) {
            this.updateItem(+slot, item);
        }
    }

    /**
     * Returns the item at the specified slot.
     *
     * @param slot - The slot to get the item from.
     */
    public getItem(slot: number): ItemStack | undefined {
        if(slot < 0 || slot >= this.containerSize) {
            throw new Error(`Slot ${slot} is out of range (container has ${this.containerSize} slots)`);
        }
        return this.inventory[slot];
    }

    /**
     * Returns the contents of the container.
     */
    public getContents(): ContainerInventory {
        return this.inventory;
    }

    /**
     * Sets a custom name to the container.
     *
     * @param name - The name to set.
     *
     * @remarks This needs to be set BEFORE sending the container.
     */
    public setCustomName(name: string): void {
        this.customName = name;
    }

    /**
     * Sends the container's nbt data to the client.
     */
    private sendNbtData(pairLead: number = 0): void {
        const pk = BlockActorDataPacket.allocate();
        pk.pos.set(pairLead ? this.position : this.position2);
        let nbtData: Record<string, Tag> = {};
        if(this.customName) nbtData["CustomName"] = StringTag.constructWith(this.customName);
        nbtData["pairlead"] = ByteTag.constructWith(pairLead);
        nbtData["pairx"] = IntTag.constructWith(pairLead ? this.position2.x : this.position.x);
        nbtData["pairz"] = IntTag.constructWith(pairLead ? this.position2.z : this.position.z);
        for(const [key, tag] of Object.entries(nbtData)) pk.data.set(key, tag);
        pk.sendTo(this.netId);
        pk.dispose();
        for (const tag of Object.values(nbtData)) tag.destruct();
    }

    /**
     * Callback is triggered when the player interacts with an item,
     * in the container, or in it's inventory.
     */
    public onTransaction(callback: TransactionCallback): void {
        this.transactionCallback = callback;
    }

    /**
     * Returns whether a transaction callback is set.
     */
    private hasTransactionCallback(): boolean {
        return this.transactionCallback !== undefined;
    }

    /**
     * Calls the transaction callback.
     */
    public callTransactionCallback(action: ItemStackRequestActionTransferBase): void | CANCEL {
        if(this.hasTransactionCallback()) return this.transactionCallback(action);
    }

    /**
     * Callback is triggered when the player closes the container, or is forced to do so.
     */
    public onContainerClose(callback: ContainerCloseCallback): void {
        this.containerCloseCallback = callback;
    }

    /**
     * Returns whether a container close callback is set.
     */
    private hasContainerCloseCallback(): boolean {
        return this.containerCloseCallback !== undefined;
    }

    /**
     * Calls the container close callback.
     */
    public callContainerCloseCallback(): void {
        if(this.hasContainerCloseCallback()) this.containerCloseCallback();
        this.destruct();
    }

    private destroyContainer(pos: BlockPos): void {
        const pk = UpdateBlockPacket.allocate();
        pk.blockPos.construct(pos);
        pk.dataLayerId = 0;
        pk.flags = UpdateBlockPacket.Flags.Network;
        pk.blockRuntimeId = Utils.getBlockAtPosition(this.netId, pos).getRuntimeId();
        pk.sendTo(this.netId);
        pk.dispose();
    }

    /**
     * Destroys the containers client-side,
     * and replaces them with the original blocks.
     */
    private destroyContainers(): void {
        this.destroyContainer(this.position);
        this.destroyContainer(this.position2);
    }

    /**
     * Destroys the containers, and destructs all the ItemStack instances.
     */
    public destruct(): void {
        this.destroyContainers();
        for(const item of Object.values(this.inventory)) {
            item.destruct();
        }
        PlayerManager.removeContainer(this.netId);
    }
}
