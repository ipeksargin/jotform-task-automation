import React, { useCallback, useState } from 'react';

function FormSelector({forms, closeExistingModal}) {
  const [id, setId] = useState(null);
  const [step, setStep] = useState('ilkStep');

  const handleFormSelect = useCallback((e) => {
    const id = e.currentTarget.getAttribute('id');
    setId(id);
    setStep('ikinciStep');
  }, []);

  if (step === 'ikinciStep') {
    return (step);
  }
  return (
    <div className="modal  d-block"
      id="myExistingModal" tabIndex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" className="close" data-dismiss="modal"
              aria-label="Close" onClick={closeExistingModal}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body" >{
            (forms.map((form) => <div className="list-group" key={form.id}>
              <button
                type="button"
                id={form.id}
                name={form['title']}
                className="list-group-item list-group-item-action"
                onClick={handleFormSelect}
              >{form['title']}</button>
            </div>))
          }
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormSelector;
