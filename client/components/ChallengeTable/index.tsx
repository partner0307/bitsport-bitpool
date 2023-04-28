import { ForwardRefExoticComponent } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button, Modal, notification } from 'antd';
import Icon, { RestOutlined } from '@ant-design/icons';
import { SERVER_URI } from '@/config';
import { IState } from '@/store';

interface RecordType {
    title: string;
    difficalty: number;
    streak: number;
    amount: number;
    qc: number;
    coin_sku: string;
    status: number;
    _id: string
}

const ChallengeTable = () => {
    const [data, setData] = useState([]);
    const model = useSelector((state: IState) => state.challenge.model);

    useEffect(() => {
        axios.get(`${SERVER_URI}/challenge/index`).then(res => {
            setData(res.data.model);
        })
    }, [model]);

    const onRemove = (id: string) => {
        Modal.confirm({
            title: 'Remove',
            content: 'Are you sure to remove the challenge?',
            onOk() {
                axios.delete(`${SERVER_URI}/challenge/remove/${id}`).then(res => {
                    if(res.data.success) {
                        notification.success({ message: 'Success!', description: 'The challenge was removed successfully!' });
                        setData(data.filter((p: RecordType) => p._id !== res.data.model._id))
                    } else {
                        notification.warning({ message: 'Error!', description: res.data.message });
                    }
                })
            }
        })
    }

    const source: any = useMemo(() => data.map((p: object, i) => { return { ...p, index: i + 1, key: i } }), [data]);

    return <>
        <Table dataSource={source} columns={[
            { title: 'Id', dataIndex: 'index' },
            { title: 'Title', dataIndex: 'title' },
            { title: 'Difficalty', dataIndex: 'difficalty' },
            { title: 'Streak', dataIndex: 'streak' },
            { title: 'Amount', dataIndex: 'amount' },
            { title: 'QC', dataIndex: 'qc' },
            { title: 'Coin Sku', dataIndex: 'coin_sku' },
            { title: 'Status', render: (text, record: RecordType) => record.status === 1 ? 'Actived' : 'Completed' },
            { title: 'createdAt', dataIndex: 'createdAt', render: (text, record) => moment(text).format('YYYY-MM-DD HH:mm:ss') },
            { title: 'Action', render: (text, record) => <Button type='link' onClick={() => onRemove(record._id)}><Icon style={{fontSize: 18, color: '#999'}} component={RestOutlined as ForwardRefExoticComponent<any>} /></Button> }
        ]} />
    </> ;
}

export default ChallengeTable;