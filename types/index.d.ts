type Settings = {
	clone?: boolean;
};

type Input = Record<string, unknown> | Array<Record<string, unknown>>;

type Modifier = Record<string, unknown> | Array<Record<string, unknown>>;

type Output = Partial<Input> & Partial<Modifier>;
