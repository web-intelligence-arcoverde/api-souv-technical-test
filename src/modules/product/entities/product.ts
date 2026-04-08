export interface IProduct {
	id?: string | number;
	category: string;
	name: string;
	quantity: number;
	unit: string;
	checked: boolean;
}

export class Product {
	constructor(readonly product: IProduct) {}
}
