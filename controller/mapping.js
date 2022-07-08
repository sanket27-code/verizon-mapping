const fs = require('fs');
const verizonData = require('../dbs/mergedJsonData.json');
const IndustryData = require('../dbs/dbIndustryData.json');
const { IndustrySector, AttackVector, AttackType, ActorType, CompanyType, Region, CountryFilter, RegionCode, SectorCode, CountryCode } = require('../constants/jpData');

console.log(IndustryData.length);

const result = [];
const result2 = [];
verizonData.forEach(element => {
    const obj = {};
    obj["name"] = {
        "en": element["summary"],
        "jp": ""
    };
    obj["image"] = {
        "en": "",
        "jp": ""
    };
    obj["description"] = {
        "en": element["summary"],
        "jp": ""
    };
    obj["impact"] = {
        "en": "NA",
        "jp": "NA"
    };
    obj["additionalInformation"] = [
        {
            "title": {
                "en": "",
                "jp": ""
            },
            "description": {
                "en": "",
                "jp": ""
            }
        }
    ];

    const timeline = element["timeline"]["incident"];
    obj["timeline"] = timeline;
    if(("day" in timeline) && ("month" in timeline) && ("year" in timeline)){
        obj["attackDate"] = new Date(timeline["year"], timeline["month"] - 1, timeline["day"]);
    }else{
        obj["attackDate"] = "NA"
    }
    

    const actorType = Object.keys(element["actor"])[0]
    obj["actorType"] = {
        "en": actorType,
        "jp": ActorType[actorType.toLowerCase()]
    };

    const attackVector = Object.keys(element["action"])[0];
    obj["attackType"] = {
        "en": element["action"][attackVector]?.variety?.[0] || "",
        "jp": AttackType?.[element["action"][attackVector]?.variety?.[0]] || ""
    };
    obj["attackVector"] = {
        "en": attackVector,
        "jp": AttackVector[attackVector.toLowerCase()]
    };

    obj["reference"] = element["reference"];
    obj["attackSource"] = "https://github.com/vz-risk/VCDB";

    obj["companyName"] = {
        "en": element["victim"]["victim_id"],
        "jp": ""
    };
    obj["companyType"] = {
        "en": "NA",
        "jp": "NA"
    };

    const sector = element["victim"]["industry"].slice(0, 2);
    obj["sector"] = {
        "en": SectorCode[sector],
        "jp": IndustrySector[SectorCode[sector]]
    };

    const originalCountry = element?.["victim"]?.["country"][0]
    obj["originalCountry"] = {
        "en": CountryCode[originalCountry],
        "jp": ""
    }
    if (CountryCode[originalCountry] in CountryFilter) {
        obj["country"] = {
            "en": CountryCode[originalCountry],
            "jp": CountryFilter[CountryCode[originalCountry]]
        };
    } else {
        obj["country"] = {
            "en": "Other",
            "jp": "Other"
        };
    }

    const region = element["victim"]?.region?.[0].slice(0, 3);
    obj["region"] = {
        "en": RegionCode[region] || "",
        "jp": Region[RegionCode[region]] || "",
    };

    obj["revenue"] = {
        "value": {
            "$numberLong": "NA"
        },
        "currency": "NA",
        "year": "NA"
    };
    obj["revenueWiseCategory"] = "";
    obj["employeeCount"] = "";

    const employee_count = element["victim"]["employee_count"];
    if ((employee_count == "Unknown") || (employee_count == "")) {
        obj["employeeWiseCategory"] = "No Data";
    } else if ((employee_count == "1 to 10") || (employee_count == "11 to 100") || (employee_count == "101 to 1000") || (employee_count == "Small")) {
        obj["employeeWiseCategory"] = "Small";
    } else if ((employee_count == "1001 to 10000") || (employee_count == "10001 to 25000") || (employee_count == "25001 to 50000") || (employee_count == "50001 to 100000") || (employee_count == "Over 100000") || (employee_count == "Large")) {
        obj["employeeWiseCategory"] = "Large";
    }

    const companyId = IndustryData.filter((item)=>{
        return (item["companyName"]["en"]==obj["companyName"]["en"] && item["country"]["en"]==obj["country"]["en"])
    })
    obj["companyId"] = companyId[0]["_id"]["$oid"];

    obj["reference"] = element["reference"]
    obj["isDelete"] = 0;
    obj["createdAt"] = "2022-06-07T13:20:45.812Z";
    obj["updatedAt"] = "2022-06-07T13:20:45.812Z";
    obj["type"] = "attack-data";

    result.push(obj);

    // ------------


    // const obj2 = {};
    // obj2.companyName = {
    //     "en": element["victim"]["victim_id"],
    //     "jp": ""
    // };
    // obj2.companyType = {
    //     "en": "NA",
    //     "jp": "NA"
    // };
    // obj2.sector = {
    //     "en": SectorCode[sector],
    //     "jp": IndustrySector[SectorCode[sector]]
    // };
    // obj2["originalCountry"] = {
    //     "en": CountryCode[originalCountry],
    //     "jp": ""
    // }
    // if (CountryCode[originalCountry] in CountryFilter) {
    //     obj2["country"] = {
    //         "en": CountryCode[originalCountry],
    //         "jp": CountryFilter[CountryCode[originalCountry]]
    //     };
    // } else {
    //     obj2["country"] = {
    //         "en": "Other",
    //         "jp": "Other"
    //     };
    // }
    // obj2["region"] = {
    //     "en": RegionCode[region] || "",
    //     "jp": Region[RegionCode[region]] || "",
    // };
    // obj2["revenue"] = {
    //     "value": {
    //         "$numberLong": "NA"
    //     },
    //     "currency": "NA",
    //     "year": "NA"
    // };
    // obj2["revenueWiseCategory"] = "";
    // obj2.employeeCount = "";
    // if ((employee_count == "Unknown") || (employee_count == "")) {
    //     obj2["employeeWiseCategory"] = "NA";
    // } else if ((employee_count == "1 to 10") || (employee_count == "11 to 100") || (employee_count == "Small")) {
    //     obj2["employeeWiseCategory"] = "Small";
    // } else if ((employee_count == "101 to 1000")){
    //     obj2["employeeWiseCategory"] = "Medium";
    // } else if ((employee_count == "1001 to 10000") || (employee_count == "10001 to 25000") || (employee_count == "25001 to 50000") || (employee_count == "50001 to 100000") || (employee_count == "Over 100000") || (employee_count == "Large")) {
    //     obj2["employeeWiseCategory"] = "Large";
    // }
    // obj2.sitrUrl = "";
    // obj2.establishmentDate = "";
    // obj2.associatedNumbers = {};
    // obj2.addressInfo = {};
    // obj2.contactInfo = {};
    // obj2.financialInfo = {};
    // obj2.type = "industry-data";
    // obj2.isDelete = 0;
    // obj2.createdAt = "2022-06-08T07:11:02.291Z";
    // obj2.updatedAt = "2022-06-08T07:11:02.291Z";
    // result2.push(obj2);
});

console.log(result.length);
fs.writeFileSync('dbs/attackJsonData.json', JSON.stringify(result, null, 2));

// console.log(result2.length);
// fs.writeFileSync('dbs/industryJsonData1.json', JSON.stringify(result2, null, 2));

// let filteredList = [...new Set(result2.map(JSON.stringify))].map(JSON.parse);
// console.log(filteredList.length);
// fs.writeFileSync('dbs/UniqueIndustryJsonData1.json', JSON.stringify(filteredList, null, 2));







