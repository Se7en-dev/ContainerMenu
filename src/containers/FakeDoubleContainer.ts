import { FakeContainer } from "./FakeContainer";
import { BlockPos } from "bdsx/bds/blockpos";
import { PlayerManager } from "../PlayerManager";
import { Utils } from "../utils/Utils";
import { bedrockServer } from "bdsx/launcher";
import { BlockActorDataPacket } from "bdsx/bds/packets";
import { ByteTag, IntTag, StringTag, Tag } from "bdsx/bds/nbt";
import { Block } from "bdsx/bds/block";
import { ContainerType } from "bdsx/bds/inventory";
import { ServerPlayer } from "bdsx/bds/player";
import { ContainerInventory } from "../ContainerMenu";


export class FakeDoubleContainer extends FakeContainer {
    private position2: BlockPos;

    constructor(block: Block, containerType: ContainerType, containerSize: number, player: ServerPlayer, destructItems: boolean = true, inventory: ContainerInventory = {}) {
        super(block, containerType, containerSize, player, destructItems, inventory);
    }

    /**
     * Sends the fake container to the client.
     */
    public sendToPlayer(): void {
        PlayerManager.setContainer(this.netId, this);
        this.position = Utils.getAbovePosition(this.netId);
        this.position2 = BlockPos.create(this.position.x+1, this.position.y, this.position.z);
        this.placeContainer(this.position);
        this.placeContainer(this.position2);
        this.sendNbtData(true);
        this.sendNbtData(false);
        bedrockServer.serverInstance.nextTick().then(() => {
            this.openContainer();
            this.updateAllItems();
        });
    }

    /**
     * Sends the container's nbt data to the client.
     */
    private sendNbtData(pairLead: boolean = false): void {
        const pk = BlockActorDataPacket.allocate();
        pk.pos.set(pairLead ? this.position : this.position2);
        let nbtData: Record<string, Tag> = {};
        if(this.customName) nbtData["CustomName"] = StringTag.constructWith(this.customName);
        nbtData["pairlead"] = ByteTag.constructWith(pairLead ? 1 : 0);
        nbtData["pairx"] = IntTag.constructWith(pairLead ? this.position2.x : this.position.x);
        nbtData["pairz"] = IntTag.constructWith(pairLead ? this.position2.z : this.position.z);
        for(const [key, tag] of Object.entries(nbtData)) pk.data.set(key, tag);
        pk.sendTo(this.netId);
        pk.dispose();
        for (const tag of Object.values(nbtData)) tag.destruct();
    }

    /**
     * Destroys the containers, and destructs all the ItemStack instances, if needed.
     */
    public destruct(): void {
        this.destroyContainer(this.position);
        this.destroyContainer(this.position2);
        if(this.destructItems) {
            this.destructAllItems();
        }
        PlayerManager.removeContainer(this.netId);
    }
}