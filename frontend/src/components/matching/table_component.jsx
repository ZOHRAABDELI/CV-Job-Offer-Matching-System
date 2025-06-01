import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const TableComponent = ({ data }) => {
  // Initialize tableData from props and maintain state properly
  const [tableData, setTableData] = useState([]);
  
  // Update tableData whenever the data prop changes
  useEffect(() => {
    if (data && data.length > 0) {
      setTableData(data.map(item => ({
        ...item,
        original_decision: item.original_decision || item.decision || (
          item.total_score >= 80 ? '● Accepted' :
          item.total_score >= 70 ? '● Pending' :
          '● Shortlisted'
        ),
        decision: item.decision || (
          item.total_score >= 80 ? '● Accepted' :
          item.total_score >= 70 ? '● Pending' :
          '● Shortlisted'
        )
      })));
    }
  }, [data]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editedDecision, setEditedDecision] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('All');
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  
  // Memoize sectionNames to prevent unnecessary recalculations
  const sectionNames = useMemo(() => {
    return tableData && tableData.length > 0 ? Object.keys(tableData[0].section_scores || {}) : [];
  }, [tableData]);
  
  // Initialize visibleColumns state properly
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [tempVisibleColumns, setTempVisibleColumns] = useState([]);
  
  // Update visibleColumns only when sectionNames is first populated or changes significantly
  useEffect(() => {
    if (sectionNames.length > 0 && visibleColumns.length === 0) {
      // Only set initial state if visibleColumns is empty
      setVisibleColumns(sectionNames);
      setTempVisibleColumns(sectionNames);
    } else if (sectionNames.length > 0 && visibleColumns.length > 0) {
      // Update tempVisibleColumns to include new sections but preserve existing visibility choices
      const newSections = sectionNames.filter(section => !visibleColumns.includes(section));
      if (newSections.length > 0) {
        setTempVisibleColumns(prev => [...prev, ...newSections]);
      }
    }
  }, [sectionNames]); // Only depend on sectionNames
  
  if (!tableData || tableData.length === 0) {
    return <p>No data available</p>;
  }

  const getApplicantName = (resume) => resume?.replace('.json', '') || 'Unknown';

  const handleEditClick = (rowIndex, event) => {
    const row = event.target.closest('tr');
    const rect = row.getBoundingClientRect();
    setModalPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX + rect.width + 10,
    });
    setCurrentRowIndex(rowIndex);
    setEditedDecision(tableData[rowIndex].decision);
    setIsModalOpen(true);
  };

  const handleSaveDecision = () => {
    const updatedData = [...tableData];
    updatedData[currentRowIndex].decision = editedDecision;
    setTableData(updatedData);
    setIsModalOpen(false);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    }
    return ' ⇅';
  };
  
  const handleDownloadExcel = () => {
    if (!tableData || tableData.length === 0) {
      alert('No data available to export.');
      return;
    }
  
    const exportData = tableData.map((item) => {
      const row = {
        Name: item.resume?.replace('.json', '') || '',
        ...item.section_scores, // Section scores
        Total: item.total_score ?? '',
        Original_Decision: item.original_decision ?? '',
        Current_Decision: item.decision ?? '',
      };
      return row;
    });
  
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Matched CVs');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'matched_cvs.xlsx');
  };
  
  const sortedData = [...tableData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const valA = sortConfig.key === 'total_score'
      ? a.total_score
      : a.section_scores?.[sortConfig.key];
    const valB = sortConfig.key === 'total_score'
      ? b.total_score
      : b.section_scores?.[sortConfig.key];

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
    }

    return sortConfig.direction === 'asc'
      ? String(valA || '').localeCompare(String(valB || ''))
      : String(valB || '').localeCompare(String(valA || ''));
  });

  const filteredData = sortedData.filter(item => {
    if (decisionFilter === 'All') return true;
    return item.decision === decisionFilter;
  });

  return (
    <section style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={decisionFilter}
            onChange={(e) => setDecisionFilter(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="All">All</option>
            <option value="● Accepted">Accepted</option>
            <option value="● Pending">Pending</option>
            <option value="● Shortlisted">Shortlisted</option>
          </select>
          <button
            onClick={() => {
              // Make sure tempVisibleColumns reflects current state
              setTempVisibleColumns([...visibleColumns]);
              setIsColumnModalOpen(true);
            }}
            style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }}
          >
            <span style={{ marginRight: '5px' }}>⚙</span>View
          </button>

          <button
            onClick={handleDownloadExcel}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 12px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#28a745',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="16"
              height="16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
              />
            </svg>
            Download
          </button>
        </div>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>Applicant Name</th>
            {visibleColumns.map((section) => (
              <th
                key={section}
                style={{ ...headerStyle, cursor: 'pointer' }}
                onClick={() => handleSort(section)}
              >
                {section}
                <span>{renderSortArrow(section)}</span>
              </th>
            ))}
            <th
              style={{ ...headerStyle, cursor: 'pointer' }}
              onClick={() => handleSort('total_score')}
            >
              Total Score
              <span>{renderSortArrow('total_score')}</span>
            </th>
            <th style={headerStyle}>Algorithm Decision</th>
            <th style={headerStyle}>Final Decision</th>
            <th style={headerStyle}>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, rowIndex) => {
            return (
              <tr key={rowIndex} style={getRowStyle(rowIndex)}>
                <td style={cellStyle}>{getApplicantName(item.resume)}</td>
                {visibleColumns.map((section, colIndex) => (
                  <td key={colIndex} style={cellStyle}>
                    {item.section_scores?.[section]}
                  </td>
                ))}
                <td style={cellStyle}>{item.total_score}</td>
                <td style={cellStyle}>
                  <span
                    style={{
                      ...badgeStyle,
                      backgroundColor:
                        item.original_decision === '● Accepted'
                          ? '#E9FFEF'
                          : item.original_decision === '● Shortlisted'
                          ? '#FFDDDD'
                          : '#FFF2DD',
                      color:
                        item.original_decision === '● Accepted'
                          ? '#008D36'
                          : item.original_decision === '● Shortlisted'
                          ? '#E30613'
                          : '#D98634',
                    }}
                  >
                    {item.original_decision}
                  </span>
                </td>
                <td style={cellStyle}>
                  <span
                    style={{
                      ...badgeStyle,
                      backgroundColor:
                        item.decision === '● Accepted'
                          ? '#E9FFEF'
                          : item.decision === '● Shortlisted'
                          ? '#FFDDDD'
                          : '#FFF2DD',
                      color:
                        item.decision === '● Accepted'
                          ? '#008D36'
                          : item.decision === '● Shortlisted'
                          ? '#E30613'
                          : '#D98634',
                    }}
                  >
                    {item.decision}
                  </span>
                </td>
                <td
                  style={{
                    ...cellStyle,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span
                    onClick={(event) => handleEditClick(rowIndex, event)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '24px',
                      color: '#007BFF',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isModalOpen && (
        <div
          className="fixed"
          style={{
            top: `${modalPosition.top + 80}px`,
            left: `${modalPosition.left - 400}px`,
            zIndex: 10,
            transition: 'top 0.3s ease, left 0.3s ease',
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Edit Decision</h2>
            <p>Editing: {getApplicantName(tableData[currentRowIndex].resume)}</p>
            <div className="mt-4">
              <label
                htmlFor="decision"
                className="block text-sm font-medium mb-2"
              >
                Decision:
              </label>
              <select
                id="decision"
                value={editedDecision}
                onChange={(e) => setEditedDecision(e.target.value)}
                className="block p-2 border border-gray-300 rounded-md"
              >
                <option value="● Accepted">Accepted</option>
                <option value="● Pending">Pending</option>
                <option value="● Shortlisted">Shortlisted</option>
              </select>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={handleSaveDecision}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isColumnModalOpen && (
        <div
          className="fixed z-50"
          style={{ top: '250px', right: '40px' }}
          onClick={() => setIsColumnModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 shadow-lg w-96 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Select Visible Columns</h3>
            <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2">
              {sectionNames.map((section) => (
                <label key={section} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={tempVisibleColumns.includes(section)}
                    onChange={() => {
                      setTempVisibleColumns((prev) =>
                        prev.includes(section)
                          ? prev.filter((col) => col !== section)
                          : [...prev, section]
                      );
                    }}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded"
                  />
                  <span className="text-gray-800">{section}</span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsColumnModalOpen(false)}
                className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setVisibleColumns([...tempVisibleColumns]);
                  setIsColumnModalOpen(false);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

// --- STYLES ---
const headerStyle = {
  border: '1px solid #ddd',
  padding: '10px',
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
};

const cellStyle = {
  padding: '10px',
  paddingTop: '20px',
  paddingBottom: '20px',
  border: '0.5px solid #ddd',
  textAlign: 'center',
};

const badgeStyle = {
  padding: '5px 10px',
  borderRadius: '15px',
  fontWeight: 'bold',
};

const getRowStyle = (rowIndex) => {
  return {
    backgroundColor: rowIndex % 2 === 0 ? '#FFF' : '#F9FAFC',
  };
};

export default TableComponent;