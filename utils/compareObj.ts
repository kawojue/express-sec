function compareObjects(objects: any[]) {
    if (objects.length === 0) {
        return false
    }

    const referenceObject: any = objects[0]
    for (let i = 1; i < objects.length; i++) {
        const currentObject: any = objects[i]

        if (
            currentObject.ipAddress !== referenceObject.ipAddress ||
            currentObject.userAgent !== referenceObject.userAgent
        ) {
            return false
        }
    }

    return true
}

export default compareObjects
