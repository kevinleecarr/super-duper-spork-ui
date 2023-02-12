import {Text, Card, NumberInput, TextInput, Button, Group, Box, Container, Title} from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from "axios";
import React from "react";

const CreateCustomer = ({updatePage}:any) => {
    const form = useForm({
        initialValues: {
            name: '',
            subdomain: ''
        },

        validate: {
        },
    });

    const sporkApiBaseUrl = process.env.SPORK_API_BASE_URL;

    const onSubmit = async (values: any) => {
        await axios.post(`${sporkApiBaseUrl}/api/v1/customers`, values);
        console.log(values);
        updatePage();
    }

    return (
        <Container size="xs" p="md">
            <Card shadow="sm" radius="md" withBorder>
                <Title order={1}>Create Customer</Title>
        <Box sx={{ maxWidth: 300 }} mx="auto">
            <form onSubmit={form.onSubmit(onSubmit)}>
                <TextInput
                    withAsterisk
                    label="Name"
                    placeholder="Customer name"
                    {...form.getInputProps('name')}
                />

                <TextInput
                    withAsterisk
                    label="Subdomain"
                    placeholder="Subdomain"
                    {...form.getInputProps('subdomain')}
                />

                <Group position="right" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </Box>
            </Card>
        </Container>
    );
}

export default CreateCustomer;