const refactorItemDetail = (item, department) => {
  if (department === false) {
    return {
      ...item, departmentEmail: null, departmentId: null, departmentName: null, departmentTelNo: null,
      placeBuilding: null, placeFloor: null, placeId: null, placeRoom: null,
    }
  } else {

    return { ...item, userTelNo: null, email: null, Name: null }
  }
}

module.exports = refactorItemDetail