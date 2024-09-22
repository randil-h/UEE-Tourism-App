// CustomDatePicker.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { DateTimePicker } from '@react-native-community/datetimepicker';

const CustomDatePicker = ({ visible, onClose, onConfirm }) => {
    const [date, setDate] = useState(new Date());

    const handleConfirm = () => {
        onConfirm(date);
        onClose();
    };

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            const currentDate = selectedDate || date;
                            setDate(currentDate);
                        }}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={styles.button}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleConfirm} style={styles.button}>
                            <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    button: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    },
});

export default CustomDatePicker; // Make sure this is a default export

