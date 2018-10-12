export class User {
                public id: number;
                public name: string;
                public email: string;
                public password: string;
                public confirmPassword: string;
                // public roles: string;
    constructor(user?) {
        this.id = user.id || 0;
        this.name = user.name || '';
        this.email = user.email || '';
        this.password = user.pass || '';
        this.confirmPassword = user.confirmPassword || '';
    }
}

export class Category {
    public id: number;
    public parent_id: number;
    public name: string;
    public notes: string;
    public children: Category[];

    constructor(category?) {
        this.id = category.id || 0;
        this.parent_id = category.parent_id || 0;
        this.name = category.name || '';
        this.notes = category.notes || '';
        this.children = category.children || [new Category()];
    }
}

export class Supplier {
    public id: number;
    public name: string;
    public type: string;
    public price: number;
    public rating: { id: number, rating: number };
    public product_images: [
        {
            id: number,
            small: string,
            medium: string,
            large: string
        }
        ];

    constructor(supplier?) {
        this.id = supplier.id || 0;
        this.name = supplier.name || '';
        this.type = supplier.type || '';
        this.price = supplier.price || 0;
        this.rating = supplier.rating || {};
        this.product_images = supplier.product_images || [];
    }
}

export class Product {
    public id: number;
    public name: string;
    public short_description: string;
    public long_description: string;
    public price: number;
    public stock: number;
    public sku: string;
    public count: number;
    public active: number;
    public category: Category;
    public category_id: number;
    public rating: { id: number, rating: number };
    public suppliers: Supplier[];
    public images: [{ id: number, small: string, medium: string, large: string }];
    product_supplier_attributes: [
        {
            id: number,
            product_supplier_id: number,
            option_set_id: number,
            option_id: number,
            operation: string,
            changeBy: string,
            amount: number,
            option_set: { id: number, name: string },
            option: { id: number, value: string }
        }
        ];
    product_variants: [
        {
            id: number,
            sku: string,
            weight: number,
            width: number,
            height: number,
            depth: number,
            stock: number,
            operation: string,
            changeBy: string,
            amount: number,
            product_variant_attributes: [
                {
                    product_variant_id: number,
                    option_set_id: number,
                    option_id: number
                }
                ],
            images: [
                {
                    id: number,
                    small: string,
                    medium: string,
                    large: string
                }
                ]
        }
        ];
    public oldPrice: number;
    public newPrice: number;
    public discount: number;
    public ratingsCount: number;
    public ratingsValue: number;
    public description: string;
    public availibilityCount: number;
    public color: Array<string>;
    public size: Array<string>;
    public weight: number;

    // public categoryId: number;

    constructor() {
        this.id = 0;
        this.name = '';
        this.short_description = '';
        this.long_description = '';
        this.price = 0;
        this.stock = 0;
        this.sku = '';
        this.count = 0;
        this.active = 0;
        this.category_id = 0;
        this.category = new Category();
        this.rating = {id: 0, rating: 0};
        this.suppliers = [new Supplier()];
        this.images = [
            {
                id: 0,
                small: '',
                medium: '',
                large: ''
            }
        ];
        this.product_supplier_attributes = [
            {
                id: 0,
                product_supplier_id: 0,
                option_set_id: 0,
                option_id: 0,
                operation: '',
                changeBy: '',
                amount: 0,
                option_set: {id: 0, name: ''},
                option: {id: 0, value: ''}
            }
        ];
        this.product_variants = [
            {
                id: 0,
                sku: '',
                weight: 0,
                width: 0,
                height: 0,
                depth: 0,
                stock: 0,
                operation: '',
                changeBy: '',
                amount: 0,
                product_variant_attributes: [
                    {
                        product_variant_id: 0,
                        option_set_id: 0,
                        option_id: 0
                    }
                ],
                images: [
                    {
                        id: 0,
                        small: '',
                        medium: '',
                        large: ''
                    }
                ]
            }
        ];
        this.oldPrice = 0;
        this.newPrice = 0;
        this.discount = 0;
        this.ratingsCount = 0;
        this.ratingsValue = 0;
        this.description = '';
        this.availibilityCount = 100;
        this.color = [];
        this.size = [];
        this.weight = 0;
        // this.categoryId = 0;
    }
}
