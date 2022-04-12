import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { BlockPos } from "bdsx/bds/blockpos";
import { Block } from "bdsx/bds/block";

export namespace Utils {
    /**
     * TODO: return the correct position, not feet pos.
     */
    export function getBehindPosition(netId: NetworkIdentifier): BlockPos {
        const actor = netId.getActor()!;
        return BlockPos.create(actor.getFeetPos());
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