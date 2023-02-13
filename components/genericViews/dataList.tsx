import React, { useState, useEffect } from 'react'
import {TextInput, Button, Card, Container, Table, Text, Title} from '@mantine/core'
import axios from 'axios'
import { IconTrash } from '@tabler/icons';
import {openModal} from "@mantine/modals";
import {confirmDelete} from "@/components/genericComponents/confirmDelete";

interface Props {
    transformer?: (data: any) => any;
    name: string;
    endpoint: string;
    columns: { name: string; key: string }[];
}

export const DataList: React.FC<Props> = (
  {
      transformer,
      name,
      endpoint,
      columns
  }
) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await axios.get(endpoint);
        setData(transformer ? transformer(response.data) : response.data);
    };

    const column = (name:string) => {
        return <th key={name}>{name}</th>;
    }

    const handleDelete = async (id: string) => {
        await axios.delete(`${endpoint}/${id}`);
        fetchData();
    }

    const headers = [
        ...columns.map(col => column(col.name)),
        column('Actions')
    ];

    const rows = data.map((item: any) => (
        <tr key={item._id}>
            {[...columns.map(col => {
                const val = item[col.key];
                if (col.key === 'name') {
                    return <td key={col.key}><a href={'/customer/' + item['_id']}>{val}</a></td>
                }
                return (
                    <td key={col.key}>{Array.isArray(val) ?  (
                        <div>
                            {val.map(function(d, idx){
                                return (<li key={idx}>{d}</li>)
                            })}
                        </div>
                    ): val?.toString()}</td>
                );
            }),
                <td key="actions">
                    {
                        item._id &&
                        (<Button leftIcon={<IconTrash size={14} />} onClick={
                            () => confirmDelete(item.name, () => {}, () => handleDelete(item._id))
                        }>Delete</Button>)
                    }
                </td>
            ]}
        </tr>
    ));

    console.log("spork2" + endpoint);

    return (
        <Container size="xl" p="md">
            <Card shadow="sm" radius="md" withBorder>
                <Title order={1}>{name}</Title>
                <Table striped highlightOnHover>
                    <thead>
                    <tr>
                        {headers}
                    </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </Card>
        </Container>
    );
};