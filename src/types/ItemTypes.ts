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

type SorcsIncantsDataObject =
    | (ItemDataObject & {
          type: string;
          cost: number;
          slots: number;
          effects: string;
          requires: Object[];
      })
    | any;

type WeaponsShieldsDataObject =
    | (ItemDataObject & {
          attack: Object[];
          defence: Object[];
          scalesWith: Object[];
          requiredAttributes: Object[];
          category: string;
          weight: number;
      })
    | any;

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
    image: any;
    description: string;
    // only armor has categories for now
    // potentially many other item types could have a category
    category?: any;
    buildDispatch?: (action: Object) => void;
};

type BuildProps = {
    build: any;
    color: string;
    size: string;
    buildDispatch: (action: Object) => void;
};

enum VALID_BUILD_ITEM_CATEGORIES {
    FULLBUILD = "FULLBUILD",
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

interface buildAction {
    type: any;
    id: string | null;
    build: any;
}

interface buildState {
    weapons: BuildItem[];
    armor: BuildItem[];
    sorcs: BuildItem[];
    incants: BuildItem[];
    ashes: BuildItem[];
    spirits: BuildItem[];
    talismans: BuildItem[];
    shields: BuildItem[];
    starting_class: BuildItem;
}

type IncludePreviouslyRolled = {
    weapons: boolean;
    ashes: boolean;
    incants: boolean;
    shields: boolean;
    sorcs: boolean;
    spirits: boolean;
    talis: boolean;
    [key: string]: boolean;
};

type RolledItems = {
    weapons: string[];
    // armor: string[];
    ashes: string[];
    incants: string[];
    shields: string[];
    sorcs: string[];
    spirits: string[];
    talis: string[];
    starting_class: string;
    [key: string]: string | string[];
};

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
    buildAction,
    buildState,
    IncludePreviouslyRolled,
    RolledItems,
};
