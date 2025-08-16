import { Project } from "ts-morph";
import * as path from "path";
/**
 * Finds a TypeScript type or interface by name in the project.
 * @param typeName Name of the type or interface.
 * @returns The Type object for the found type or interface.
 * @throws Error if the type or interface is not found.
 */
export function findTypeByName(typeName) {
    const tsConfigPath = path.resolve(process.cwd(), "tsconfig.json");
    console.log(`[simule] Loading tsconfig from: ${tsConfigPath}`);
    const project = new Project({ tsConfigFilePath: tsConfigPath });
    let targetType;
    const sourceFiles = project.getSourceFiles();
    console.log(`[simule] Found ${sourceFiles.length} source files`);
    for (const sourceFile of sourceFiles) {
        const filePath = sourceFile.getFilePath();
        const typeAliases = sourceFile.getTypeAliases();
        const interfaces = sourceFile.getInterfaces();
        console.log(`[simule] Checking file: ${filePath}`);
        for (const typeAlias of typeAliases) {
            if (typeAlias.getName() === typeName) {
                console.log(`[simule] Found type alias: ${typeName}`);
                targetType = typeAlias.getType();
                break;
            }
        }
        if (targetType)
            break;
        for (const iface of interfaces) {
            if (iface.getName() === typeName) {
                console.log(`[simule] Found interface: ${typeName}`);
                targetType = iface.getType();
                break;
            }
        }
        if (targetType)
            break;
    }
    if (!targetType) {
        console.error(`[simule] Type or interface "${typeName}" not found. Source files:`, sourceFiles.map((f) => f.getFilePath()));
        throw new Error(`Type or interface "${typeName}" not found in the project. Ensure it is defined in a file included in tsconfig.json.`);
    }
    return targetType;
}
