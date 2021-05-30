import { useState } from 'react';
import Editext from 'react-editext';

import styles from './styles.module.scss';

interface Repository {
    id: number;
    name: string;
    description: string;
    url: string;
    tags?: string[];
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
            if (inputValue.length != 0 && !tags.includes(inputValue)) {
                setTags(tags.concat(inputValue));
            }
        }
    };

    const deleteTag = (tagIndex: number) => {
        setTags(tags.filter((tag, index) => index !== tagIndex));
        toggleEditingTag();
    };

    const editTag = (tagName: string, tagIndex: number) => {
        setTags(tags.map((tag, index) => {
            if (index === tagIndex) return tagName;
            return tag;
        }));
        toggleEditingTag();
    };

    return (<div className={styles.repo} >
        <div className={styles.repoHeader}>
            <a href={repo.url}>{repo.name}</a>
            <ul className={styles.tags}>
                {tags.map((tag, index) => {
                    return (<li key={tag}>
                        <Editext
                            value={tag}
                            editOnViewClick={true}
                            submitOnEnter={true}
                            cancelOnEscape={true}
                            cancelOnUnfocus={true}
                            onEditingStart={toggleEditingTag}
                            onCancel={toggleEditingTag}
                            onSave={(value) => { editTag(value, index); }}
                        />
                        {isEditingTag &&
                            <button onMouseDown={() => { deleteTag(index); }} className={styles.deleteTag}>x</button>
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