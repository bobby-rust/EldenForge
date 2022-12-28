type ItemDataObject = {
    id: string;
    name: string;
    image: string | null;
    description: string;
};

type ArmorDataObject = ItemDataObject & {
    category: string;
    dmgNegation: Object[];
    resistance: Object[];
    weight: number;
};

type AshesDataObject = ItemDataObject & {
    affinity: string;
    skill: string | null;
};

type ClassDataObject = ItemDataObject & {
    stats: Object;
};

type SorcsIncantsDataObject = ItemDataObject & {
    type: string;
    cost: number;
    slots: number;
    effects: string;
    requires: Object[];
};

type WeaponsShieldsDataObject = ItemDataObject & {
    attack: Object[];
    defence: Object[];
    scalesWith: Object[];
    requiredAttributes: Object[];
    category: string;
    weight: number;
};

type SpiritsDataObject = ItemDataObject & {
    fpCost: string;
    hpCost: string;
    effect: string;
};

type TalismansDataObject = ItemDataObject & {
    effect: string;
};

type BuildItem = {
    // An array of these is what will exist
    // in the global state for each category
    id: string;
    name: string;
    image: string;
    description: string;
    // only armor has categories for now
    // potentially many other item types could have a category
    category?: string;
    buildDispatch?: (id: string, build: any, category: string) => void;
};

type BuildProps = {
    items: BuildItem[];
    color: string;
    size: string;
    buildDispatch: (id: string, build: any, category: string) => void;
};

enum VALID_BUILD_ITEM_CATEGORIES {
    WEAPONS = "WEAPONS",
    ASHES = "ASHES",
    INCANTS = "INCANTS",
    SORCS = "SORCS",
    SPIRITS = "SPIRITS",
    TALIS = "TALIS",
    SHIELDS = "SHIELDS",
}

interface buildNumsAction {
    type: VALID_BUILD_ITEM_CATEGORIES;
    payload: number;
}

interface buildNumsState {
    weapons: number;
    ashes: number;
    incants: number;
    sorcs: number;
    spirits: number;
    talis: number;
    shields: number;
}

interface rerollItemAction {
    type: VALID_BUILD_ITEM_CATEGORIES;
    id: string;
    build: BuildItem[];
}

export type {
    ItemDataObject,
    ArmorDataObject,
    AshesDataObject,
    TalismansDataObject,
    SorcsIncantsDataObject,
    WeaponsShieldsDataObject,
    SpiritsDataObject,
    ClassDataObject,
    BuildItem,
    BuildProps,
    VALID_BUILD_ITEM_CATEGORIES,
    buildNumsAction,
    buildNumsState,
    rerollItemAction,
};
