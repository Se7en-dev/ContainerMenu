import { Block } from "bdsx/bds/block";
import { ContainerType } from "bdsx/bds/inventory";
import { ServerPlayer } from "bdsx/bds/player";
import { ContainerInventory, ContainerSize } from "../ContainerMenu";
import { FakeContainer } from "./FakeContainer";

export class DispenserContainer extends FakeContainer {
    public constructor(player: ServerPlayer, destructItems?: boolean, inventory?: ContainerInventory) {
        super(
            Block.create("minecraft:dispenser")!,
            ContainerType.Dispenser,
            ContainerSize.Dispenser,
            player,
            destructItems,
            inventory
        );
    }
}