export class Category {
    constructor(public id: number,
                public name: string,
                public hasSubCategory: boolean,
                public parent_id: number,
                public notes: string,
                public children: Category[] ) {
    }
}

export class Product {
    constructor(public id: number,
                public name: string,
                public short_description: string,
                public long_description: string,
                public avg_price: string,
                public active: number,
                public category_id: number,
                public rating: {
                    id: number,
                    rating: number
                },
                // public brand: [],
                public suppliers: [
                    {
                        id: number,
                        name: string,
                        type: string,
                        images: [
                            {
                                id: number,
                                url: string
                            }
                            ],
                        price: number,
                        ean: string,
                        sku: string,
                        upc: string,
                        weight: number,
                        height: number,
                        depth: number
                    }
                ],
                public images: Array<any>,
                public oldPrice: number,
                public newPrice: number,
                public discount: number,
                public ratingsCount: number,
                public ratingsValue: number,
                public description: string,
                public availibilityCount: number = 100,
                public color: Array<string>,
                public size: Array<string>,
                public weight: number,
                public categoryId: number) {
    }
}
