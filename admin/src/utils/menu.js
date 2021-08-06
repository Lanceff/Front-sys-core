export function getLeafMenuIds(menus) {
    let leafMenuIds = []
    for (let menu of menus) {
        if (menu.children == null) {
            leafMenuIds.push(menu.id)
        } else {
            leafMenuIds.concat(getLeafMenuIds(menu.children))
        }
    }
    return leafMenuIds;
}