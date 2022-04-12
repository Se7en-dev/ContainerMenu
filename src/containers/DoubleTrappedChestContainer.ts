import { Block } from "bdsx/bds/block";
import { ContainerType } from "bdsx/bds/inventory";
import { ServerPlayer } from "bdsx/bds/player";
import { BlockPos } from "bdsx/bds/blockpos";
import { ContainerInventory, ContainerSize } from "../ContainerMenu";
import { BlockActorDataPacket, UpdateBlockPacket } from "bdsx/bds/packets";
import { PlayerManager } from "../PlayerManager";
import { Utils } from "../utils/Utils";
import { bedrockServer } from "bdsx/launcher";
import { ByteTag, IntTag, StringTag } from "bdsx/bds/nbt";
import { FakeDoubleContainer } from "./FakeDoubleContainer";

export class DoubleTrappedChestContainer extends FakeDoubleContainer {
    public constructor(player: ServerPlayer, inventory?: ContainerInventory) {
        super(
            Block.create("minecraft:trapped_chest")!,
            ContainerType.Container,
            ContainerSize.DoubleChest,
            player,
            inventory
        );
    }
}