import { ScopeEnum } from "../../../api/openapi";


export interface MenuTileDetail {
    title: string;
    icon: string;
    link: string;
    requiredScope: ScopeEnum;
}

export const availableMenuTiles: MenuTileDetail[] = [
    {title: "Kunden", icon: "group", link: "/client", requiredScope: ScopeEnum.Office},
    {title: "Aufträge", icon: "domain", link: "/job", requiredScope: ScopeEnum.Office},
    {title: "Nachkalkulation", icon: "calculate", link: "/recalculation", requiredScope: ScopeEnum.Office},
    {title: "Bestellungen", icon: "local_grocery_store", link: "/order", requiredScope: ScopeEnum.Office},
    {title: "Lieferanten", icon: "local_shipping", link: "/supplier", requiredScope: ScopeEnum.Office},
    {title: "Lieferscheine", icon: "assignment", link: "/delivery_note", requiredScope: ScopeEnum.Office},
    {
        title: "Rechnungen",
        icon: "money",
        link: "/invoice",
      requiredScope:ScopeEnum.Office
    },
    {title: "Benutzer", icon: "person", link: "/user", requiredScope:ScopeEnum.Office},
    {title: "Arbeitstag", icon: "schedule", link: "/work_day", requiredScope: ScopeEnum.Office},
    {title: "Einstellungen", icon: "settings", link: "/settings", requiredScope: ScopeEnum.Office},
    {title: "Kontakte", icon: "phone", link: "/phone_book", requiredScope:ScopeEnum.Office},
];

export function matchScopesToMenuTiles(scopes: ScopeEnum[]): MenuTileDetail[] {
  return availableMenuTiles.filter(tile => scopes.includes(tile.requiredScope));
}

