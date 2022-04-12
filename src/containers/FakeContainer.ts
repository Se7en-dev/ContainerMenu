import { Block } from "bdsx/bds/block";
import { ContainerType, ItemStack, NetworkItemStackDescriptor } from "bdsx/bds/inventory";
import { ServerPlayer } from "bdsx/bds/player";
import {
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


export enum FakeContainerType {
    Chest
}

export enum ContainerSize {
    Chest = 27
}

export type ContainerInventory = Record<number, ItemStack>;
type TransactionCallback = (action: ItemStackRequestActionTransferBase) => void | CANCEL;
type ContainerCloseCallback = () => void;

export class FakeContainer {
    private netId: NetworkIdentifier;
    private containerId: number;
    private position: BlockPos;
    private block: Block;
    private containerType: ContainerType;
    private containerSize: number;
    private inventory: ContainerInventory;

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

    private placeContainer() {
        const pk = UpdateBlockPacket.allocate();
        pk.blockPos.construct(this.position);
        pk.dataLayerId = 0;
        pk.flags = UpdateBlockPacket.Flags.Network;
        pk.blockRuntimeId = this.block.getRuntimeId();
        pk.sendTo(this.netId);
        pk.dispose();
    }

    private openContainer() {
        const pk = ContainerOpenPacket.allocate();
        pk.containerId = this.containerId;
        pk.type = this.containerType;
        pk.pos.construct(this.position);
        pk.sendTo(this.netId);
        pk.dispose();
    }

    public sendToPlayer() {
        PlayerManager.setContainer(this.netId, this);
        this.position = Utils.getBehindPosition(this.netId);
        this.placeContainer();
        bedrockServer.serverInstance.nextTick().then(() => {
            this.openContainer();
            this.updateAllItems();
        });
    }

    public forceCloseContainer(): void {
        const pk = ContainerClosePacket.allocate();
        pk.containerId = this.containerId;
        pk.server = true;
        pk.sendTo(this.netId);
        pk.dispose();
    }

    public onTransaction(callback: TransactionCallback): void {
        this.transactionCallback = callback;
    }

    private hasTransactionCallback(): boolean {
        return this.transactionCallback !== undefined;
    }

    public callTransactionCallback(action: ItemStackRequestActionTransferBase): void | CANCEL {
        if(this.hasTransactionCallback()) return this.transactionCallback(action);
    }

    public onContainerClose(callback: ContainerCloseCallback): void {
        this.containerCloseCallback = callback;
    }

    private hasContainerCloseCallback(): boolean {
        return this.containerCloseCallback !== undefined;
    }

    public callContainerCloseCallback(): void {
        if(this.hasContainerCloseCallback()) return this.containerCloseCallback();
        this.destruct();
    }


    public setItem(slot: number, item: ItemStack) {
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

    private updateAllItems(): void {
        for (let [slot, item] of Object.entries(this.inventory)) {
            this.updateItem(+slot, item);
        }
    }

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

    public addItem(item: ItemStack) {
        for(let i = 0; i < this.containerSize; i++) {
            if(!this.inventory[i]) {
                this.setItem(i, item);
                return;
            }
        }
    }

    public setContents(contents: ContainerInventory) {
        for(const [slot, item] of Object.entries(contents)) {
            this.setItem(+slot, item);
        }
    }

    public getItem(slot: number): ItemStack | undefined {
        if(slot < 0 || slot >= this.containerSize) {
            throw new Error(`Slot ${slot} is out of range (container has ${this.containerSize} slots)`);
        }
        return this.inventory[slot];
    }

    public getContents(): ContainerInventory {
        return this.inventory;
    }

    private destroyContainer() {
        const pk = UpdateBlockPacket.allocate();
        pk.blockPos.construct(this.position);
        pk.dataLayerId = 0;
        pk.flags = UpdateBlockPacket.Flags.Network;
        pk.blockRuntimeId = Utils.getBlockAtPosition(this.netId, this.position).getRuntimeId();
        pk.sendTo(this.netId);
        pk.dispose();
    }

    private destruct() {
        this.destroyContainer();
        for(const item of Object.values(this.inventory)) {
            item.destruct();
        }
        PlayerManager.removeContainer(this.netId);
    }
}
