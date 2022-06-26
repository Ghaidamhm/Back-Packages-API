export function upsertPackagesController(packages: any[], newPackages: any) {
	const packageIndex = packages.findIndex((el) => el.id === newPackages.id);
	if (packageIndex === -1) {
		packages.push(newPackages);
	} else {
		packages[packageIndex] = {
			...packages[packageIndex],
			...newPackages,
		};
	}
	return packages;
}