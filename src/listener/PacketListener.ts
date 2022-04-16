import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { PlayerManager } from "../PlayerManager";
import { CANCEL } from "bdsx/common";
import { ItemStackRequestActionTransferBase } from "bdsx/bds/packets";

export namespace PacketListener {

    export function loadListeners() {

        events.packetBefore(MinecraftPacketIds.ItemStackRequest).on((packet, netId) => {
            if(PlayerManager.hasContainer(netId)) {
                const container = PlayerManager.getContainer(netId)!;
                packet.getRequestBatch().data.toArray().forEach((requestData) => {
                    requestData.actions.toArray().forEach((action) => {
                        if(action instanceof ItemStackRequestActionTransferBase) {
                            if(container.callTransactionCallback(action) !== CANCEL) {
                                /*
                                TODO :
                                 handle non cancelled requests (allow items to be taken/placed etc)
                                 (ItemStackResponsePacket needs to be implemented)
                                 */
                            }
                        }
                    });
                });
            }
        });

        events.packetBefore(MinecraftPacketIds.ContainerClose).on((packet, netId) => {
            if(PlayerManager.hasContainer(netId)) {
                const container = PlayerManager.getContainer(netId)!;
                container.callContainerCloseCallback();
            }
        });

        events.networkDisconnected.on((netId) => {
            PlayerManager.getContainer(netId)?.destruct();
        });
    }
}
