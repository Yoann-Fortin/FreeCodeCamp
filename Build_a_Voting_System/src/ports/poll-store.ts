export interface PollStore {
	hasOption: (option: string) => boolean;
	addOption: (option: string) => void;
	getVoters: (option: string) => Set<string> | undefined;
	options: () => Iterable<[string, Set<string>]>;
}
