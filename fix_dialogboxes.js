const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\Ken\\Documents\\ken-ocqn\\GitHub\\employee-management-system\\client\\src\\components\\common\\Dashboard\\dialogboxes.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update AddEmployeesDialogBox state
content = content.replace(
    '        evaluationdate: "",\n        regularizationdate: ""',
    '        evaluationdate: "",\n        regularizationdate: "",\n        employmentstatus: "Probationary"'
);
// Also handle CRLF if needed (though readFileSync in utf8 should handle it if split/replace is careful)
content = content.replace(
    '        evaluationdate: "",\r\n        regularizationdate: ""',
    '        evaluationdate: "",\r\n        regularizationdate: "",\r\n        employmentstatus: "Probationary"'
);

// 2. Update AddEmployeesDialogBox validation
const validationTarget = `            case 'startdate':
                if (value && !validateFutureDate(value)) {
                    error = 'Cannot be in the future';
                }
                break;`;
const validationReplacement = `            case 'startdate':
                if (value && !validateFutureDate(value)) {
                    error = 'Cannot be in the future';
                }
                break;
            case 'employmentstatus':
                if (!value) {
                    error = 'Please select an employment status';
                }
                break;`;
content = content.replace(validationTarget, validationReplacement);
// CRLF version
content = content.replace(validationTarget.replace(/\n/g, '\r\n'), validationReplacement.replace(/\n/g, '\r\n'));

// 3. Update AddEmployeesDialogBox UI (Employment tab)
const uiTarget = `                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Designation</label>
                                            <input type="text" name="designation" value={formdata.designation} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>`;
const uiReplacement = `                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Designation</label>
                                            <input type="text" name="designation" value={formdata.designation} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Employment Status</label>
                                            <select 
                                                name="employmentstatus" 
                                                value={formdata.employmentstatus} 
                                                onChange={handleformchange} 
                                                className={\`border-2 rounded px-2 py-1 \${errors.employmentstatus ? 'border-red-500' : 'border-gray-700'}\`}
                                            >
                                                <option value="Probationary">Probationary</option>
                                                <option value="Regular">Regular</option>
                                                <option value="Outsourced">Outsourced</option>
                                                <option value="External">External</option>
                                            </select>
                                            {errors.employmentstatus && <span className="text-red-500 text-xs mt-1">{errors.employmentstatus}</span>}
                                        </div>`;
content = content.replace(uiTarget, uiReplacement);
content = content.replace(uiTarget.replace(/\n/g, '\r\n'), uiReplacement.replace(/\n/g, '\r\n'));

// 4. Update UpdateEmployeeDialogBox state
// This one is slightly different because it's inside a useEffect or initial state
// The initial state for UpdateEmployeeDialogBox is around line 948
content = content.replace(
    '        evaluationdate: "",\n        regularizationdate: ""\n    })',
    '        evaluationdate: "",\n        regularizationdate: "",\n        employmentstatus: "Probationary"\n    })'
);
content = content.replace(
    '        evaluationdate: "",\r\n        regularizationdate: ""\r\n    })',
    '        evaluationdate: "",\r\n        regularizationdate: "",\r\n        employmentstatus: "Probationary"\r\n    })'
);

// 5. Update UpdateEmployeeDialogBox useEffect (data population)
content = content.replace(
    '                evaluationdate: employee.evaluationdate ? employee.evaluationdate.split(\'T\')[0] : "",\n                regularizationdate: employee.regularizationdate ? employee.regularizationdate.split(\'T\')[0] : "",\n            })',
    '                evaluationdate: employee.evaluationdate ? employee.evaluationdate.split(\'T\')[0] : "",\n                regularizationdate: employee.regularizationdate ? employee.regularizationdate.split(\'T\')[0] : "",\n                employmentstatus: employee.employmentstatus || "Probationary",\n            })'
);
content = content.replace(
    '                evaluationdate: employee.evaluationdate ? employee.evaluationdate.split(\'T\')[0] : "",\r\n                regularizationdate: employee.regularizationdate ? employee.regularizationdate.split(\'T\')[0] : "",\r\n            })',
    '                evaluationdate: employee.evaluationdate ? employee.evaluationdate.split(\'T\')[0] : "",\r\n                regularizationdate: employee.regularizationdate ? employee.regularizationdate.split(\'T\')[0] : "",\r\n                employmentstatus: employee.employmentstatus || "Probationary",\r\n            })'
);

// 6. Update UpdateEmployeeDialogBox UI
// We can use the same uiTarget and replacement if it matches, but it has different formdata name (actually it's the same name in this file)
// Let's check UpdateEmployeeDialogBox UI
// It starts around line 1230

const updateUiTarget = `                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Designation</label>
                                            <input type="text" name="designation" value={formdata.designation} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>`;
// This is the SAME as AddEmployeesDialogBox UI. content.replace(uiTarget, uiReplacement) might have already replaced both if I used a regex with /g.
// But I didn't. So I'll run it again or use /g.
content = content.replace(new RegExp(uiTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), uiReplacement);
content = content.replace(new RegExp(uiTarget.replace(/\n/g, '\r\n').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), uiReplacement.replace(/\n/g, '\r\n'));


// 7. Update EmployeeDetailsDialogBox UI
const detailsTarget = `                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Designation</label>
                                            <p className="text-base">{employeeData.designation || "N/A"}</p>
                                        </div>`;
const detailsReplacement = `                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Designation</label>
                                            <p className="text-base">{employeeData.designation || "N/A"}</p>
                                        </div>
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Employment Status</label>
                                            <p className="text-base">{employeeData.employmentstatus || "Probationary"}</p>
                                        </div>`;
content = content.replace(detailsTarget, detailsReplacement);
content = content.replace(detailsTarget.replace(/\n/g, '\r\n'), detailsReplacement.replace(/\n/g, '\r\n'));


fs.writeFileSync(filePath, content);
console.log('Successfully updated dialogboxes.jsx');
