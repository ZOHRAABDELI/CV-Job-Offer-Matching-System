import React, { useState } from 'react';

const TableComponent = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc',
  });

  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  const getApplicantName = (resume) => {
    return resume.replace('.json', '');
  };

  const sectionNames = Object.keys(data[0].section_scores);

  const handleEditClick = (rowIndex, event) => {
    const row = event.target.closest('tr');
    const rect = row.getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + window.scrollY + 10,
      left: rect.left + window.scrollX,
    });
    setCurrentRowIndex(rowIndex);
    setIsModalOpen(true);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const valA =
      sortConfig.key === 'total_score'
        ? a.total_score
        : a.section_scores[sortConfig.key];
    const valB =
      sortConfig.key === 'total_score'
        ? b.total_score
        : b.section_scores[sortConfig.key];

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
    }

    return sortConfig.direction === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const renderSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    }
    return ' ⇅';
  };
  

  return (
    <section style={{ padding: '20px' }}>
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
            {sectionNames.map((section) => (
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
            <th style={headerStyle}>Decision</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, rowIndex) => (
            <tr key={rowIndex} style={getRowStyle(rowIndex)}>
              <td style={cellStyle}>{getApplicantName(item.resume)}</td>

              {sectionNames.map((section, colIndex) => (
                <td key={colIndex} style={cellStyle}>
                  {item.section_scores[section]}
                </td>
              ))}

              <td style={cellStyle}>{item.total_score}</td>

              <td style={cellStyle}>
                <span
                  style={{
                    ...badgeStyle,
                    backgroundColor: getDecisionColor(item.total_score),
                    color: getTextColor(item.total_score),
                  }}
                >
                  {getDecisionText(item.total_score)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div
          className="fixed"
          style={{
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            zIndex: 10,
            transition: 'top 0.3s ease, left 0.3s ease',
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Edit Decision</h2>
            <p>Editing: {getApplicantName(data[currentRowIndex].resume)}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Close
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
  border: '1px solid #ddd',
  textAlign: 'center',
};

const badgeStyle = {
  padding: '5px 10px',
  borderRadius: '15px',
  fontWeight: 'bold',
};

const getDecisionColor = (score) => {
  if (score >= 85) return '#E9FFEF';
  if (score >= 70) return '#FFF2DD';
  if (score < 70) return '#FFDDDD';
  return '#FFF';
};

const getTextColor = (score) => {
  if (score >= 85) return '#008D36';
  if (score >= 70) return '#D98634';
  if (score < 70) return '#E30613';
  return '#000';
};

const getDecisionText = (score) => {
  if (score >= 85) return '● Accepted';
  if (score >= 70) return '● Pending';
  if (score < 70) return '● Shortlisted';
  return 'Unknown';
};

const getRowStyle = (rowIndex) => {
  return {
    backgroundColor: rowIndex % 2 === 0 ? '#FFF' : '#F9FAFC',
  };
};

export default TableComponent;
