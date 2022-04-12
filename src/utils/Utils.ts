import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { BlockPos } from "bdsx/bds/blockpos";
import { Block } from "bdsx/bds/block";

export namespace Utils {
    /**
     * TODO: return the correct position, not feet pos.
     *
     */
    export function getBehindPosition(netId: NetworkIdentifier): BlockPos {
        const actor = netId.getActor()!;
        return BlockPos.create(actor.getFeetPos());
    }

    export function getBlockAtPosition(netId: NetworkIdentifier, pos: BlockPos): Block {
        return netId.getActor()!.getRegion().getBlock(pos);
    }
}