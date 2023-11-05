let jsonData = {};

let csvData = "department,equipment,eq_id,type,location,area,observation,reference,refCountry,comment,source,rating,new_area,new_obs,new_src,audit_name,audit_id,country\n";

let new_area = false;
let new_obs = false;
let new_src = false;

let download = false;

let auditName = "";
let auditId = "";

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

document.getElementById("dataFormBtn").addEventListener("click", function (e) {

    download = false;

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
    const comment = document.getElementById("comment").value;

    if(!department){
        alert("Select a department");
        return;
    }

    if(!equipment){
        alert("Select an equipment");
        return;
    }

    if(!area){
        alert("Select an area");
        return;
    }

    if(!observation){
        alert("Select an observation");
        return;
    }

    if(new_area && !comment){
        alert("Comment why you have added a new area");
        return;
    }

    if(new_obs && !comment){
        alert("Comment why you have added a new observation");
        return;
    }


    csvData += `${department},${equipment},${equipmentId},${equipmentType},${equipmentLocation},${area},${observation},${reference},${refCountry},${comment ? comment : "N/A"},${src},${rat},${new_area},${new_obs},${new_src},${auditName},${auditId},${refCountry}\n`;

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
    download = true;
});

window.addEventListener("beforeunload", function (e) {
    if (!download) {
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

    auditName = data.auditName;
    auditId = data.auditId;


    if (data.departments && data.departments.length > 0) {
        const option = document.createElement('option');
        option.textContent = "Select a department"
        option.value = ""
        departmentSelect.appendChild(option);

        data.departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.name;
            option.textContent = department.name;
            departmentSelect.appendChild(option);
        });
    }

    if (data.areas && data.areas.length > 0) {
        const option = document.createElement('option');
        option.textContent = "Select an area"
        option.value = ""
        areaSelect.appendChild(option);

        data.areas.forEach(area => {
            const option = document.createElement('option');
            option.value = area.area;
            option.textContent = area.area;
            areaSelect.appendChild(option);
        });
    }

    document.getElementById("newsrcbtn").addEventListener("click", function () {

        new_src = true;

        sourceSelect.innerHTML = ''

        const newsrc = newSource.value.toLowerCase();
        const option = document.createElement('option');
        option.textContent = newsrc;
        option.value = newsrc;
        sourceSelect.appendChild(option);
        sourceSelect.value = newsrc;

        data.sources.forEach(src => {
            const option = document.createElement('option');
            option.value = src.source;
            option.textContent = src.source;
            sourceSelect.appendChild(option);
        });
    });

    document.getElementById("newareabtn").addEventListener("click", function () {
        const newAreaInput = document.getElementById("newArea");
        const newAreaName = newAreaInput.value.toLowerCase();

        new_area = true;
    
        if (newAreaName.trim() === "") {
            alert("Please enter a valid area name.");
            return;
        }
    
        // Add the new area to the selectArea dropdown
        const areaSelect = document.getElementById("selectArea");
        const newAreaOption = document.createElement('option');
        newAreaOption.textContent = newAreaName;
        newAreaOption.value = newAreaName;
        areaSelect.appendChild(newAreaOption);
        areaSelect.value = newAreaName;
    
        
        observationSelect.innerHTML = '';

        const newOption = document.createElement('option');
        newOption.textContent = "Select an Observation";
        newOption.value = "";
        observationSelect.appendChild(newOption);
        observationSelect.value = "NA"

            data.observation.forEach(obsId => {
                const observation = data.observation.find(obs => obs.id === obsId.id);
                if (observation) {
                    const option = document.createElement('option');
                    option.value = observation.observation;
                    option.textContent = observation.observation; 
                    observationSelect.appendChild(option);
                }
            });

        newAreaInput.value = '';
    });

    document.getElementById("newobsbtn").addEventListener("click", function () {
        const newObsInput = document.getElementById("newObservation");
        const newObsName = newObsInput.value.toLowerCase();

        new_obs = true;
    
        if (newObsName.trim() === "") {
            alert("Please enter a valid observation.");
            return;
        }
    
        // Add the new area to the selectArea dropdown
        const observationSelect = document.getElementById("selectObservation");
        const newObsOption = document.createElement('option');
        newObsOption.textContent = newObsName;
        newObsOption.value = newObsName;
        observationSelect.appendChild(newObsOption);
        observationSelect.value = newObsName;
    
        referenceSelect.innerHTML = '';

        const newOption = document.createElement('option');
        newOption.textContent = "Select a Reference";
        newOption.value = "";
        referenceSelect.appendChild(newOption);
        referenceSelect.value = "NA"

        data.references.forEach(refId => {
            const reference = data.references.find(ref => ref.id === refId.id);
            if (reference) {
                const option = document.createElement('option');
                option.value = reference.reference;
                option.textContent = reference.reference + " " + reference.country; 
                referenceSelect.appendChild(option);
            }
        });

        newObsInput.value = '';
    });
    

    if (data.sources && data.sources.length > 0) {
        const option = document.createElement('option');
        option.textContent = "Select a source"
        option.value = ""
        sourceSelect.appendChild(option);

        data.sources.forEach(src => {
            const option = document.createElement('option');
            option.value = src.source;
            option.textContent = src.source;
            sourceSelect.appendChild(option);
        });
    }

    if(data.ratings && data.ratings.length>0){
        const option = document.createElement('option');
        option.textContent = "Select a rating"
        option.value = ""
        ratingSelect.appendChild(option);

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

                const option = document.createElement('option');
                option.textContent = "Select an equipment"
                option.value = ""
                selectEquipment.appendChild(option);

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

    sourceSearch.addEventListener("input", function(){
        const searchValue = sourceSearch.value.toLowerCase();
        const sourceOptions = selectSource.getElementsByTagName("option");

        for (let i = 0; i < sourceOptions.length; i++) {
            const option = sourceOptions[i];
            const sourceName = option.textContent.toLowerCase();

            if (sourceName.indexOf(searchValue) === -1) {
                option.style.display = "none";
            } else {
                option.style.display = "block";
            }
        }
    })


    areaSearch.addEventListener("input", function(){
        const searchValue = areaSearch.value.toLowerCase();
        const areaOptions = selectArea.getElementsByTagName("option");

        for (let i = 0; i < areaOptions.length; i++) {
            const option = areaOptions[i];
            const areaName = option.textContent.toLowerCase();

            if (areaName.indexOf(searchValue) === -1) {
                option.style.display = "none";
            } else {
                option.style.display = "block";
            }
        }
    })

    

    observationSearch.addEventListener("input", function(){
        const searchValue = observationSearch.value.toLowerCase();
        const obsOptions = selectObservation.getElementsByTagName("option");

        for (let i = 0; i < obsOptions.length; i++) {
            const option = obsOptions[i];
            const obsName = option.textContent.toLowerCase();

            if (obsName.indexOf(searchValue) === -1) {
                option.style.display = "none";
            } else {
                option.style.display = "block";
            }
        }
    })

    

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

            new_area = false;

            const areaId = selectedArea.id;
            const filteredObservations = data.areaObs.filter(obs => obs.areaId === areaId);
            const uniqueObservationIds = [...new Set(filteredObservations.map(obs => obs.observationId))];
            observationSelect.innerHTML = '';

            const option = document.createElement('option');
            option.textContent = "Select an observation"
            option.value = ""
            observationSelect.appendChild(option);

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

            new_obs = false;
            
            const obsId = selectedObservation.id;
            const filteredRefs = data.obsRef.filter(ref => ref.obsId === obsId);
            const uniqueRefIds = [...new Set(filteredRefs.map(ref => ref.refId))];
            referenceSelect.innerHTML = '';

            const option = document.createElement('option');
            option.textContent = "Select a reference"
            option.value = ""
            referenceSelect.appendChild(option);

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


