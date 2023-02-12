import React, {useEffect, useState} from 'react';
import {
    Stepper,
    Card,
    NumberInput,
    TextInput,
    Button,
    Group,
    Box,
    Container,
    ThemeIcon,
    Text,
    SimpleGrid, Stack, Space, Radio, Checkbox
} from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from "axios";
import { IconTrophy } from '@tabler/icons';
import {useRouter} from "next/router";

const CustomerJourney = () => {
    const router = useRouter();
    const [active, setActive] = useState(1);
    const [completed, setCompleted] = useState(false);
    const { id } = router.query;

    useEffect(() => {
        if(!router.isReady) return;
        fetchData();
    }, [router.isReady]);

    const [data, setData] = useState({
        _id: '',
        name: '',
        oktaOrgId: '',
        subdomain: '',
        oktaLinkedProductId: '',
        oktaSkus: [],
    });

    const sporkApiBaseUrl = process.env.SPORK_API_BASE_URL;

    const fetchData = async () => {
         const response = await axios.get(sporkApiBaseUrl + '/api/v1/customers/' + id);
         if (response.data.oktaOrgId) {
             setActive(2);
         }
         if (response.data.oktaLinkedProductId) {
             setActive(3);
         }
         setData(response.data);
    };

    const nextStep = () => {
        setActive((current:number) => (current < 4 ? current + 1 : current));
        if (active === 3) {
            setCompleted(true);
        }
    }

    const createOrg = async () => {
        await axios.post(sporkApiBaseUrl + '/api/v1/orgs', {
            ...data,
           customerId : data._id,
        });
        console.log('createOrg');
        await fetchData();
    }

    const linkOrg = async () => {
        await axios.post(sporkApiBaseUrl + '/api/v1/orgs/' + data.oktaOrgId + '/link', {
            ...data,
            customerId : data._id,
        });
        console.log('linkOrg');
        await fetchData();
    }

    const assignSKUs = async () => {
        console.log('assignSKUs');
        await axios.put(sporkApiBaseUrl + '/api/v1/customers/' + data._id, data);
        await fetchData();
        nextStep();
    }

    const setSkus = async (value: any) => {
        data.oktaSkus = value;
    }

    function reassignSKUs() {
        setActive((current:number) => current - 1);
    }

    return (
    <Container size="lg" p="md">
        <Card shadow="sm" radius="md" withBorder>
            <Stepper active={active} onStepClick={setActive} breakpoint="sm" >
                <Stepper.Step label="Customer" description="Create a Customer">
                </Stepper.Step>
                <Stepper.Step label="Okta Org" description="Create an Org in Okta">

                    <Container size="sm" mt="xl">
                        <Card shadow="sm" radius="md" withBorder>
                            <Text weight={500}>Step 1: Create an Org in Okta</Text>
                            <Space h="md" />
                        <SimpleGrid cols={2}>
                            <Box>
                                <Text weight={500}>Name:</Text>
                                <Text>{data.name}</Text>
                            </Box>
                            <Box>
                                <Text weight={500}>Subdomain:</Text>
                                <Text>{data.subdomain}</Text>
                            </Box>
                        </SimpleGrid>
                        </Card>
                    </Container>
                    <Group position="center" mt="xl">
                        <Button onClick={createOrg}>Create Org</Button>
                    </Group>
                </Stepper.Step>
                <Stepper.Step label="Link" description="Link Org to Account Service">
                    <Container size="sm" mt="xl">
                        <Card shadow="sm" radius="md" withBorder>
                            <Text weight={500}>Step 2: Link the Okta org to Account Service</Text>
                            <Space h="md" />
                            <SimpleGrid cols={2}>
                                <Box>
                                    <Text weight={500}>Name:</Text>
                                    <Text>{data.name}</Text>
                                </Box>
                                <Box>
                                    <Text weight={500}>Subdomain:</Text>
                                    <Text>{data.subdomain}</Text>
                                </Box>
                                <Box>
                                    <Text weight={500}>Okta Org Id:</Text>
                                    <Text>{data.oktaOrgId}</Text>
                                </Box>
                            </SimpleGrid>
                        </Card>
                    </Container>
                    <Group position="center" mt="xl">
                        <Button onClick={linkOrg}>Link Org</Button>
                    </Group>
                </Stepper.Step>
                <Stepper.Step label="SKUs" description="Select SKUs" completedIcon={<IconTrophy />} color={completed? "yellow" : undefined}>
                    <Container size="sm" mt="xl">
                        <Card shadow="sm" radius="md" withBorder>
                            <Text weight={500}>Step 3: Assign SKUs</Text>
                            <Space h="md" />
                            <SimpleGrid cols={2}>
                                <Box>
                                    <Text weight={500}>Name:</Text>
                                    <Text>{data.name}</Text>
                                </Box>
                                <Box>
                                    <Text weight={500}>Subdomain:</Text>
                                    <Text>{data.subdomain}</Text>
                                </Box>
                                <Box>
                                    <Text weight={500}>Okta Org Id:</Text>
                                    <Text>{data.oktaOrgId}</Text>
                                </Box>
                                <Box>
                                    <Text weight={500}>Linked Product Id:</Text>
                                    <Text>{data.oktaLinkedProductId}</Text>
                                </Box>
                                <Box>
                                    <Text weight={500}>Skus:</Text>
                                    <Checkbox.Group
                                        orientation="vertical"
                                        defaultValue={data.oktaSkus}
                                        onChange={setSkus}
                                        withAsterisk
                                    >
                                        <Checkbox value="sso" label="Workforce SSO" />
                                        <Checkbox value="mfa" label="Workforce MFA" />
                                    </Checkbox.Group>
                                </Box>
                            </SimpleGrid>
                        </Card>
                    </Container>
                    <Group position="center" mt="xl">
                        Step 3: Assign SKUs
                    </Group>
                    <Group position="center" mt="xl">
                        <Button onClick={assignSKUs}>Assign SKUs</Button>
                    </Group>
                </Stepper.Step>
                <Stepper.Completed>
                    <Group position="center" mt="xl">
                        <ThemeIcon radius="xl" size="xl" color="yellow">
                            <IconTrophy />
                        </ThemeIcon>
                        <h1>Complete!</h1>
                    </Group>
                    <Group position="center" mt="xl">
                        <Button onClick={reassignSKUs}>Reassign SKUs</Button>
                    </Group>
                </Stepper.Completed>
            </Stepper>
        </Card>

    </Container>
    );
}

export default CustomerJourney