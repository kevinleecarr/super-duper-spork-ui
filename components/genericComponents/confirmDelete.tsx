import { Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';

export const confirmDelete = (id: string, onCancel: any, onConfirm: any) => {
    console.log("open");
    openConfirmModal({
        title: 'Delete record: ' + id,
        children: (
            <Text size="sm">
                Are you sure you want to delete this record?
            </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => onCancel(),
        onConfirm: () => onConfirm(),
    });

}
