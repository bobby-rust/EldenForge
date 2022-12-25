type BuildItem = {
    name: string
    description: string
    image: string
}

type BuildItemProps = {
    color: string
    size: string
    item: BuildItem
}

// Set as in a "set" of armor or a "set" of talismans, etc.
type BuildSetProps = {
    color: string
    size: string
    items: BuildItem[]
}

export type { BuildItem, BuildItemProps, BuildSetProps }
