import { useState } from 'react';
import api from 'services/api';
import Editext from 'react-editext';

import styles from './styles.module.scss';

interface Tag {
    id: number;
    name: string;
}

interface Repository {
    id: number;
    name: string;
    description: string;
    url: string;
    tags: Tag[];
}

interface RepositoryProps {
    children: Repository;
}

export default function Repository({ children: repo }: RepositoryProps) {
    const [popupHidden, setPopupHidden] = useState(true);
    const [isEditingTag, setIsEditingTag] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState(repo.tags);

    const togglePopup = () => { setPopupHidden(!popupHidden); };
    const toggleEditingTag = () => { setIsEditingTag(!isEditingTag); };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const createTag = async (event) => {
        if (event.key === 'Enter') {
            setInputValue('');
            togglePopup();
            const tagExists = tags.some(tag => tag.name === inputValue);

            if (inputValue.length != 0 && !tagExists) {
                const { data } = await api.post('/tags', { repoId: repo.id, tagName: inputValue });
                const tag = { name: data.tagName, id: data.id };
                setTags(tags.concat(tag));
            }
        }
    };

    const deleteTag = async (deletingTag: Tag) => {
        setTags(tags.filter((tag) => tag.id !== deletingTag.id));
        await api.delete('/tags/' + deletingTag.id);
        toggleEditingTag();
    };

    const editTag = async (tagName: string, id: number) => {
        const { data } = await api.patch('/tags/' + id, { tagName });
        const editedTag = { id: data.id, name: data.tagName };

        setTags(tags.map((tag) => {
            if (tag.id === editedTag.id) return editedTag;
            return tag;
        }));
        toggleEditingTag();
    };

    return (<div className={styles.repo} >
        <div className={styles.repoHeader}>
            <a href={repo.url}>{repo.name}</a>
            <ul className={styles.tags}>
                {tags.map((tag) => {
                    return (<li key={tag.id}>
                        <Editext
                            value={tag.name}
                            editOnViewClick={true}
                            submitOnEnter={true}
                            cancelOnEscape={true}
                            cancelOnUnfocus={true}
                            onEditingStart={toggleEditingTag}
                            onCancel={toggleEditingTag}
                            onSave={(value) => { editTag(value, tag.id); }}
                        />
                        {isEditingTag &&
                            <button onMouseDown={() => { deleteTag(tag); }} className={styles.deleteTag}>x</button>
                        }
                    </li>);
                })}
            </ul>
            <button onClick={togglePopup}>add @tag</button>
        </div>
        {
            !popupHidden &&
            <div className={styles.popup}>
                <input type="text"
                    autoFocus={true}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={createTag}
                    placeholder="tag name"
                />
            </div>
        }
        <p>{repo.description}</p>
    </div >);
}