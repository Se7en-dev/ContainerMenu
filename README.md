<div style="text-align:center"><img src="./resources/containermenu.png" alt="logo" width="800"/></div>

# ContainerMenu - A BDSX API

ContainerMenu is an API for BDSX that allows you to create fake interactive container menus !

---

## Features

- Multiple containers support

- Item transactions detection

- container close detection

- possibility to dynamically change items

- custom container name !

- easy to use API

#### Available container types

- [x] Chest

- [x] Double chest

- [x] Trapped chest

- [x] Double trapped chest

- [x] Hopper

- [x] Dropper

- [x] Dispenser

...and more to come !

#### Soon to be added

- Handling of non cancelled item transactions (possibility to take/place items)

- More container types

## Installation

#### Installing as an npm module

run this command in your bdsx directory :

```shell
npm i @bdsx/containermenu
```

You can also use bdsx's `plugin-manager`

#### Installing as a standalone plugin

clone the repository in your `plugins` directory :

```git
git clone https://github.com/Se7en-dev/ContainerMenu.git
```

## Usage examples

You can simply create and display a fake chest this way :

```ts
const container = ContainerMenu.create(player, FakeContainerType.Chest);
container.sendToPlayer();
```

*everything else is handled automatically !*

You can add/delete items to the container this way :

```ts
// Sets the item in slot 0
container.setItem(0, ItemStack.constructWith("minecraft:diamond", 64));
// Adds the item to the first empty slot
container.addItem(ItemStack.constructWith("minecraft:diamond", 64));
// Set multiple items at once
container.setContents({
            5: ItemStack.constructWith("minecraft:gold_ingot", 1),
            7: ItemStack.constructWith("minecraft:iron_ingot", 1),
            9: ItemStack.constructWith("minecraft:emerald", 1),
        });
// Clears the item in slot 5
container.clearItem(5);
// Clears all items
container.clearContents();
```

*no need to destruct the ItemStacks, it is done automatically after the container is closed*

Other features :

```ts
// Set a custom name to the container
// (must be called before sending the container)
container.setCustomName("BDSX is awesome !");
// Closes the container client-side, and destructs it.
container.closeContainer();
```

Using callbacks :

```ts
container.onTransaction((action) => {
    // Do something here...
});

container.onContainerClose(() => {
    // Do something here...
});
```

*nb: returning `CANCEL` for item transactions does not change anything for now. In the future, Items will be able to be placed and taken unless `CANCEL` is returned.*

##### Simple examples

Sends a message when a diamond is clicked :

```ts
const container = ContainerMenu.create(actor, FakeContainerType.Chest);
        container.addItem(ItemStack.constructWith("minecraft:iron_ingot", 1));
        container.addItem(ItemStack.constructWith("minecraft:gold_ingot", 1));
        container.addItem(ItemStack.constructWith("minecraft:diamond", 1));
        container.sendToPlayer();
        container.onTransaction((action) => {
            if(action.type === ItemStackRequestActionType.Take && container.getItem(action.getSrc().slot)?.getName() === "minecraft:diamond") {
                container.closeContainer();
                actor.sendMessage("You have clicked the diamond!");
            }
        });
```

Sends a message when the player closes the container:

```ts
const container = ContainerMenu.create(actor, FakeContainerType.Chest);
        container.sendToPlayer();
        container.onContainerClose(() => {
            actor.sendMessage("Container closed !");
        });
```

---

## Credits

API base by [@Rjlintkh](https://github.com/Rjlintkh/)

This plugin is licensed under **GNU General Public License v3.0**

Feel free to contribute :)
