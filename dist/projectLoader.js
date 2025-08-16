import { Project } from "ts-morph";
import * as path from "path";
export function findTypeByName(typeName) {
    const tsConfigPath = path.resolve(process.cwd(), "tsconfig.json");
    const project = new Project({ tsConfigFilePath: tsConfigPath });
    let targetType;
    const sourceFiles = project.getSourceFiles();
    for (const sourceFile of sourceFiles) {
        const filePath = sourceFile.getFilePath();
        const typeAliases = sourceFile.getTypeAliases();
        const interfaces = sourceFile.getInterfaces();
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
                targetType = iface.getType();
                break;
            }
        }
        if (targetType)
            break;
    }
    if (!targetType) {
        throw new Error(`Type or interface "${typeName}" not found in the project. Ensure it is defined in a file included in tsconfig.json.`);
    }
    return targetType;
}
