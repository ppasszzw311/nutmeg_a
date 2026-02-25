import React from 'react';
import { Table } from 'react-bootstrap';

export default function DataTable({ headers, data, renderRow, emptyMessage = '尚無資料' }) {
    return (
        <div className="table-responsive responsive-table">
            <Table striped bordered hover className="align-middle text-center">
                <thead className="table-dark">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((item, index) => renderRow(item, index))
                    ) : (
                        <tr>
                            <td colSpan={headers.length}>{emptyMessage}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}
