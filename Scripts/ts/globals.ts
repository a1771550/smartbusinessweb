export enum TriggerReferrer {
	Row,
	Modal
}
export interface IReserve {
	Id: number;
	riCode: string;
	cusCode: string;
	riDate: string;
	riRemark: string;
	riCounted: number | null;
	AllSignedUp: boolean;
	Cancelled: boolean;
	PaidOut: boolean;
	ItemNames: string;
	CustomerName: string;
	ReserveDateDisplay: string;
}
export interface IReserveLn {
	Id: number;
	riCode: string;
	rilSender: string;
	itmCode: string;
	itmSellingPrice: number;
	rilQty: number;
	rilSignedUp_Sender: boolean;
	rilDate: string;
	rilCounted: number | null;
	rilVariance: number | null;
	ivIdList: string;
	poIvId: string;
	ItemNameDesc: string;
	cusCode: any;
	riDate: string;
	Cancelled: boolean;
	riRemark: string;
	PaidOut: boolean;
	CustomerName: string;
	SellingPriceDisplay: string;
}