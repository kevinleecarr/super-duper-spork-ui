import React, {useEffect, useState} from 'react';
import {
    Stepper,
    Card,
    Button,
    Group,
    Box,
    Container,
    ThemeIcon,
    Text,
    SimpleGrid,
    Space,
    Checkbox,
    Loader
} from '@mantine/core';
import axios from "axios";
import { IconTrophy } from '@tabler/icons';
import {useRouter} from "next/router";

const CustomerJourney = () => {
    const router = useRouter();
    const [active, setActive] = useState(1);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [entitledSkus, setEntitledSkus] = useState([]);
    const { id } = router.query;

    useEffect(() => {
        if(!router.isReady) return;
        fetchData();
    }, [router.isReady]);

    const [customer, setCustomer] = useState({
        _id: '',
        name: '',
        oktaOrgId: '',
        subdomain: '',
        oktaLinkedProductId: '',
        oktaSkus: [],
    });

    const sporkApiBaseUrl = process.env.SPORK_API_BASE_URL;

    async function fetchCustomer() {
        const response = await axios.get(sporkApiBaseUrl + '/api/v1/customers/' + id);
        if (response.data.oktaOrgId) {
            setActive(2);
        }
        if (response.data.oktaLinkedProductId) {
            setActive(3);
        }
        setCustomer(response.data);
    }

    async function fetchEntitledSkus() {
        const response = await axios.get(sporkApiBaseUrl + '/api/v1/account/entitledSkus');
        setEntitledSkus(response.data);
    }

    const fetchData = () => {
        fetchCustomer();
        fetchEntitledSkus();
    };

    const nextStep = () => {
        setActive((current:number) => (current < 4 ? current + 1 : current));
        if (active === 3) {
            setCompleted(true);
        }
    }

    const createOrg = async () => {
        setLoading(true);
        try {
            await axios.post(sporkApiBaseUrl + '/api/v1/orgs', {
                ...customer,
                customerId: customer._id,
            });
            console.log('createOrg');
            await fetchData();
        } finally {
            setLoading(false);
        }
    }

    const linkOrg = async () => {
        setLoading(true);
        try {
            await axios.post(sporkApiBaseUrl + '/api/v1/orgs/' + customer.oktaOrgId + '/link', {
                ...customer,
                customerId: customer._id,
            });
            console.log('linkOrg');
            await fetchData();
        } finally {
            setLoading(false);
        }
    }

    const assignSKUs = async () => {
        setLoading(true);

        try {
            console.log('assignSKUs');
            await axios.put(
              sporkApiBaseUrl + '/api/v1/customers/' + customer._id,
              customer
            );
            await fetchData();

            await axios.put(
              sporkApiBaseUrl + '/api/v1/orgs/' + customer.oktaOrgId + '/skus',
              customer.oktaSkus
            );

            nextStep();
        } finally {
            setLoading(false);
        }
    }

    const setSkus = async (value: any) => {
        customer.oktaSkus = value;
    }

    function reassignSKUs() {
        setActive((current:number) => current - 1);
    }

    const skuCheckboxes = entitledSkus?.map((sku: any) => {
        return (
            <Checkbox
                key={sku.id}
                label={sku.name}
                value={sku.id}
                onChange={setSkus}
            />
        );
    });

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
                                <Text>{customer.name}</Text>
                            </Box>
                            <Box>
                                <Text weight={500}>Subdomain:</Text>
                                <Text>{customer.subdomain}</Text>
                            </Box>
                        </SimpleGrid>
                        </Card>
                    </Container>
                    <Group position="center" mt="xl">
                        {loading
                          ? (<Loader size="sm"/>)
                          : (<Button onClick={createOrg}>Create Org</Button>)
                        }
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
                                    <Text>{customer.name}</Text>
                                </Box>
                                <Box>
                                    <Text weight={500}>Subdomain:</Text>
                                    <Text>{customer.subdomain}</Text>
                                </Box>
                                <Box>
                                    <Text weight={500}>Okta Org Id:</Text>
                                    <Text>{customer.oktaOrgId}</Text>
                                </Box>
                            </SimpleGrid>
                        </Card>
                    </Container>
                    <Group position="center" mt="xl">
                        {loading
                          ? (<Loader size="sm"/>)
                          : (<Button onClick={linkOrg}>Link Org</Button>)
                        }
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
                                    <Text>{customer.name}</Text>
                                </Box>
                                <Box>
                                    <Text weight={500}>Subdomain:</Text>
                                    <Text>{customer.subdomain}</Text>
                                </Box>
                                <Box>
                                    <Text weight={500}>Okta Org Id:</Text>
                                    <Text>{customer.oktaOrgId}</Text>
                                </Box>
                                <Box>
                                    <Text weight={500}>Linked Product Id:</Text>
                                    <Text>{customer.oktaLinkedProductId}</Text>
                                </Box>
                                <Box>
                                    <Text weight={500}>Skus:</Text>
                                    <Checkbox.Group
                                        orientation="vertical"
                                        defaultValue={customer.oktaSkus}
                                        onChange={setSkus}
                                        withAsterisk
                                    >
                                        {skuCheckboxes}
                                    </Checkbox.Group>
                                </Box>
                            </SimpleGrid>
                        </Card>
                    </Container>
                    <Group position="center" mt="xl">
                        {loading
                          ? (<Loader size="sm"/>)
                          : (<Button onClick={assignSKUs}>Assign SKUs</Button>)
                        }
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