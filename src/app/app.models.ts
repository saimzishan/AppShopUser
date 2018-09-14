export class User {
    constructor(public id: number,
                public name: string,
                public email: string,
                public password: string,
                public confirmPassword: string,
                public roles: string ) {
    }
}
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
                public price: string,
                public count: number,
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
                                small: string,
                                medium: string,
                                large: string
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
