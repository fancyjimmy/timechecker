// place files you want to import through the `$lib` alias in this folder.

export type Todo = {
	id: number;
	name: string;
	description: string;
	done: boolean;
	startingDate: Date;
	endingDate: Date;
};
