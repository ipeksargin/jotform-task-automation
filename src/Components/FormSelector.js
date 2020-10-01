import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import {convertJsonDataToArray, runGetRequestWithParams} from '../Helper/APIHelper';

const mappingKeys = [
  {id: 'status', title: 'Task Status'},
  {id: 'title', title: 'Task Title'},
  {id: 'description', title: 'Task Description'},
];

function FormSelector({forms, closeExistingModal, onSave}) {
  const [id, setId] = useState(null);
  const [step, setStep] = useState('ilkStep');
  const [formColums, setFormColumns] = useState([]);
  const [mapping, setMapping] = useState({status: null, title: null, description: null});

  const handleFormSelect = useCallback((e) => {
    async function getFormColums(formID) {
      const endPoint = `form/${formID}/questions`;
      const queryString = `?apiKey=${localStorage.getItem('apiKey')}`;
      const response = await runGetRequestWithParams(endPoint, queryString);
      const columns = convertJsonDataToArray(response.data.content);
      const filteredColumns = columns.filter((c) => c.type !== 'control_head' && c.type !== 'control_button');
      setFormColumns(filteredColumns);
      setStep('ikinciStep');
    }

    const id = e.currentTarget.getAttribute('id');
    setId(id);
    getFormColums(id);
  }, []);

  const handleMappingSelect = useCallback((e) => {
    const key = e.currentTarget.getAttribute('data-mapping-id');
    const qID = e.currentTarget.getAttribute('data-question-id');
    setMapping({...mapping, [key]: qID});
  }, [mapping]);

  const handleBackClick = useCallback(() => {
    setId(null);
    setStep('ilkStep');
  }, []);

  const handleContinueClick = useCallback((e) => {
    onSave({formID: id, mappings: mapping});
  }, [id, mapping, onSave]);

  if (step === 'ikinciStep') {
    return (
      <div
        className="modal d-block"
        id="staticBackdrop"
        data-backdrop="static"
        data-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">Choose Form Attributes</h5>
              <button
                type="button"
                className="close"
                onClick={handleBackClick}
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {
                mappingKeys.map((mappingKey) => {
                  return (
                    <>
                      <p>{`${mappingKey.title}`}: </p>
                      <div className="form-group">
                        <select className="form-control" id="exampleFormControlSelect1">
                          {
                            formColums.map((col) => (
                              <option
                                key={col.name}
                                type="button"
                                data-mapping-id={mappingKey.id}
                                data-question-id={col.qid}
                                onClick={handleMappingSelect}
                              >{col.text}</option>
                            ))
                          }
                        </select>
                      </div>
                    </>
                  );
                })
              }
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={handleBackClick}
                className="btn btn-secondary"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleContinueClick}
                className="btn btn-primary"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="modal d-block"
      id="myExistingModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Choose a Form</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={closeExistingModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body" >{
            forms.map((form) => {
              return (
                <div className="list-group" key={form.id}>
                  <button
                    type="button"
                    id={form.id}
                    name={form.title}
                    className="list-group-item list-group-item-action"
                    onClick={handleFormSelect}
                  >
                    {form.title}
                  </button>
                </div>
              );
            })
          }
          </div>
        </div>
      </div>
    </div>
  );
}

FormSelector.propTypes = {
  forms: PropTypes.array.isRequired,
  closeExistingModal: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default FormSelector;
