export function DateField(props: { startDate: string; setStartDate: any }) {
  const { startDate, setStartDate } = props;
  return (
    <>
      <h3>Date</h3>
      <div>
        <div className="form-group">
          <input
            value={startDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            name="appointmentDate"
            type="date"
          />
        </div>
      </div>
    </>
  );
}
