import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { BlockPos } from "bdsx/bds/blockpos";
import { Block } from "bdsx/bds/block";

export namespace Utils {
    /**
     * Returns the position above the player's head.
     *
     * @param netId - The network identifier of the player.
     */
    export function getAbovePosition(netId: NetworkIdentifier): BlockPos {
        const actor = netId.getActor()!;
        const pos = actor.getPosition();
        pos.y += 2;
        return BlockPos.create(pos);
    }

    /**
     * Returns the original block at the given position.
     *
     * @param netId - The network identifier of the player.
     * @param pos - The position to get the block from.
     */
    export function getBlockAtPosition(netId: NetworkIdentifier, pos: BlockPos): Block {
        return netId.getActor()!.getRegion().getBlock(pos);
    }
}