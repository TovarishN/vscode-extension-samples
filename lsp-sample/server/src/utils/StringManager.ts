
export class StringManager {
	private idMap : Map<string, number>;
	private id = 0;

	constructor() {
		this.idMap = new Map<string, number>();
	}

	public get(index: string) : number {
		let val = this.idMap.get(index);
		if(!val) {
			this.id++;
			this.idMap.set(index, this.id);
		}
		return this.idMap.get(index);
	}
}