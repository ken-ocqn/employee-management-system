const fs = require('fs');
const filePath = 'c:\\Users\\Ken\\Documents\\ken-ocqn\\GitHub\\employee-management-system\\client\\src\\components\\common\\Dashboard\\dialogboxes.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const doubleField = `                                        <div className="label-input-field flex flex-col gap-1">
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

const singleField = `                                        <div className="label-input-field flex flex-col gap-1">
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

content = content.replace(doubleField, singleField);
content = content.replace(doubleField.replace(/\n/g, '\r\n'), singleField.replace(/\n/g, '\r\n'));

fs.writeFileSync(filePath, content);
console.log('Successfully cleaned up dialogboxes.jsx');
