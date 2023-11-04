let jsonData = {};

let csvData = "Department,Equipment,EqId,Type,Location,Area,Observation,Reference,RefCountry,Source,Rating\n";

function downloadCSV() {
    const blob = new Blob([csvData], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "submissions.csv";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);

}

document.getElementById("dataForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const department = document.getElementById("selectDepartment").value;
    const equipment = document.getElementById("selectEquipment").value;
    const area = document.getElementById("selectArea").value;
    const observation = document.getElementById("selectObservation").value;
    const equipmentId = document.getElementById("selectEquipmentId").innerText;
    const equipmentType = document.getElementById("selectEquipmentType").innerText;
    const equipmentLocation = document.getElementById("selectEquipmentLocation").innerText;
    const reference = document.getElementById("selectReference").value;
    const refCountry = document.getElementById("selectReferenceCountry").innerText;
    const src = document.getElementById("selectSource").value;
    const rat = document.getElementById("selectRating").value;

    csvData += `${department},${equipment},${equipmentId},${equipmentType},${equipmentLocation},${area},${observation},${reference},${refCountry},${src},${rat}\n`;

    document.getElementById("downloadButton").style.display = "block";
    document.getElementById("dataForm").reset();
    document.getElementById("successMessage").style.display = "block";

    departmentSelect.innerHTML = '';
    equipmentSelect.innerHTML = '';
    areaSelect.innerHTML = '';
    observationSelect.innerHTML = '';
    referenceSelect.innerHTML = '';
    sourceSelect.innerHTML = '';
    ratingSelect.innerHTML = '';
});

document.getElementById("downloadButton").addEventListener("click", function () {
    downloadCSV();
});

window.addEventListener("beforeunload", function (e) {
    if (csvData.length > 0) {
        e.preventDefault();
        e.returnValue = "Your submission data will be downloaded.";
        downloadCSV();
    }
});


document.getElementById("dataFile").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            jsonData = JSON.parse(e.target.result);
            populateDropdowns(jsonData);
        } catch (error) {
            alert("Invalid JSON file. Please upload a valid JSON file.");
            console.log(error)
        }
    };

    reader.readAsText(file);
});

function populateDropdowns(data) {
    const departmentSelect = document.getElementById("selectDepartment");
    const equipmentSelect = document.getElementById("selectEquipment");
    const areaSelect = document.getElementById("selectArea");
    const observationSelect = document.getElementById("selectObservation");
    const referenceSelect = document.getElementById("selectReference");
    const sourceSelect = document.getElementById("selectSource");
    const ratingSelect = document.getElementById("selectRating");

    departmentSelect.innerHTML = '';
    equipmentSelect.innerHTML = '';
    areaSelect.innerHTML = '';
    observationSelect.innerHTML = '';
    referenceSelect.innerHTML = '';
    sourceSelect.innerHTML = '';
    ratingSelect.innerHTML = '';

    if (data.departments && data.departments.length > 0) {
        data.departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.name;
            option.textContent = department.name;
            departmentSelect.appendChild(option);
        });
    }

    if (data.areas && data.areas.length > 0) {
        data.areas.forEach(area => {
            const option = document.createElement('option');
            option.value = area.area;
            option.textContent = area.area;
            areaSelect.appendChild(option);
        });
    }

    if (data.sources && data.sources.length > 0) {
        data.sources.forEach(src => {
            const option = document.createElement('option');
            option.value = src.source;
            option.textContent = src.source;
            sourceSelect.appendChild(option);
        });
    }

    if(data.ratings && data.ratings.length>0){
        data.ratings.forEach(rat=>{
            const option = document.createElement('option');
            option.value = rat.rating;
            option.textContent = rat.rating;
            ratingSelect.appendChild(option);
        })
    }

    departmentSearch.addEventListener("input", function () {
        const searchValue = departmentSearch.value.toLowerCase();
        const departmentOptions = selectDepartment.getElementsByTagName("option");

        for (let i = 0; i < departmentOptions.length; i++) {
            const option = departmentOptions[i];
            const departmentName = option.textContent.toLowerCase();

            if (departmentName.indexOf(searchValue) === -1) {
                option.style.display = "none";
            } else {
                option.style.display = "block";
            }
        }
    });

    selectDepartment.addEventListener("change", function () {
        const selectedDepartmentName = selectDepartment.value;

        selectEquipment.innerHTML = '';

        if (selectedDepartmentName) {
            const selectedDepartment = data.departments.find(department => department.name === selectedDepartmentName);
            if (selectedDepartment) {
                const selectedDepartmentId = selectedDepartment.id;

                const filteredEquipment = data.equipments.filter(equipment => equipment.depId === selectedDepartmentId);

                filteredEquipment.forEach(equipment => {
                    const option = document.createElement('option');
                    option.value = equipment.name;
                    option.textContent = equipment.name + " " + equipment.id;
                    selectEquipment.appendChild(option);
                });
            }
        }
    });

    equipmentSearch.addEventListener("input", function () {
        const searchValue = equipmentSearch.value.toLowerCase();
        const equipmentOptions = selectEquipment.getElementsByTagName("option");

        for (let i = 0; i < equipmentOptions.length; i++) {
            const option = equipmentOptions[i];
            const equipmentName = option.textContent.toLowerCase();

            if (equipmentName.indexOf(searchValue) === -1) {
                option.style.display = "none";
            } else {
                option.style.display = "block";
            }
        }
    });

    selectEquipment.addEventListener("change", function () {
        const selectedEquipmentName = selectEquipment.value;

        if (selectedEquipmentName) {
            const selectedEquipment = data.equipments.find(equipment => equipment.name === selectedEquipmentName);
            if (selectedEquipment) {
                document.getElementById("selectEquipmentId").innerText = selectedEquipment.id;
                document.getElementById("selectEquipmentType").innerText = selectedEquipment.type;
                document.getElementById("selectEquipmentLocation").innerText = selectedEquipment.location;
            }
        }
    });


    areaSelect.addEventListener("change", function () {
        const selectedArea = data.areas.find(area => area.area === areaSelect.value);
        if (selectedArea) {
            const areaId = selectedArea.id;
            const filteredObservations = data.areaObs.filter(obs => obs.areaId === areaId);
            const uniqueObservationIds = [...new Set(filteredObservations.map(obs => obs.observationId))];
            observationSelect.innerHTML = '';

            uniqueObservationIds.forEach(obsId => {
                const observation = data.observation.find(obs => obs.id === obsId);
                if (observation) {
                    const option = document.createElement('option');
                    option.value = observation.observation;
                    option.textContent = observation.observation; 
                    observationSelect.appendChild(option);
                }
            });
        }
    });

    observationSelect.addEventListener("change", function(){
        const selectedObservation = data.observation.find(obs => obs.observation === observationSelect.value);
        if(selectedObservation){
            const obsId = selectedObservation.id;
            const filteredRefs = data.obsRef.filter(ref => ref.obsId === obsId);
            const uniqueRefIds = [...new Set(filteredRefs.map(ref => ref.refId))];
            referenceSelect.innerHTML = '';

            uniqueRefIds.forEach(refId => {
                const reference = data.references.find(ref=>ref.id===refId);
                if(reference){
                    const option = document.createElement('option');
                    option.value = reference.reference;
                    option.textContent = reference.reference + " " + reference.country;
                    referenceSelect.appendChild(option)
                }
            })
        }
    })

    selectReference.addEventListener("change", function () {
        const selectedReferenceName = selectReference.value;

        if (selectedReferenceName) {
            const selectedReference = data.references.find(reference => reference.reference === selectedReferenceName);
            if (selectedReference) {
                document.getElementById("selectReferenceCountry").innerText = selectedReference.country;
            }
        }
    });
}

document.getElementById("uploadButton").addEventListener("click", function () {
    document.getElementById("dataFile").click();
});
