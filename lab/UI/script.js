class ObjInfManager {
    #_objs = [];

    constructor(objs = []) {
        this.#_objs = Array.isArray(objs) ? objs : [];
    }

    getObjs(skip = 0, top = 10, filterConfig = {}) {
        let filteredObjs = [...this.#_objs];

        if (filterConfig) {
            for (const key in filterConfig) {
                filteredObjs = filteredObjs.filter(obj => obj[key] === filterConfig[key]);
            }
        }

        filteredObjs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return filteredObjs.slice(skip, skip + top);
    }

    getObj(id) {
        return this.#_objs.find(obj => obj.id === id) || null;
    }

    validateObj(obj) {
        if (!obj) return false;

        const { id, description, createdAt, author } = obj;
        if (
            !id || typeof id !== 'string' ||
            !description || typeof description !== 'string' || description.length > 200 ||
            !createdAt || !(createdAt instanceof Date) ||
            !author || typeof author !== 'string' || !author.trim()
        ) {
            return false;
        }

        return true;
    }

    addObj(obj) {
        if (this.validateObj(obj)) {
            this.#_objs.push(obj);
            return true;
        }
        return false;
    }

    editObj(id, updatedFields) {
        const obj = this.getObj(id);

        if (!obj) return false;

        const immutableFields = ['id', 'author', 'createdAt'];

        for (const key in updatedFields) {
            if (immutableFields.includes(key)) continue;

            if (key in obj) {
                obj[key] = updatedFields[key];
            }
        }

        return this.validateObj(obj);
    }

    removeObj(id) {
        const initialLength = this.#_objs.length;
        this.#_objs = this.#_objs.filter(obj => obj.id !== id);
        return this.#_objs.length < initialLength;
    }

    addAll(objs) {
        const invalidObjs = [];

        objs.forEach(obj => {
            if (!this.addObj(obj)) {
                invalidObjs.push(obj);
            }
        });

        return invalidObjs;
    }

    clear() {
        this.#_objs = [];
    }

    getAll() {
        return [...this.#_objs];
    }
}

const data = [
    { id: '1', description: 'Тестовый объект 1', createdAt: new Date('2023-12-01'), author: 'Иван' },
    { id: '2', description: 'Тестовый объект 2', createdAt: new Date('2023-11-15'), author: 'Петр' },
    { id: '3', description: 'Тестовый объект 3', createdAt: new Date('2023-10-05'), author: 'Анна' },
];

const manager = new ObjInfManager(data);

function renderData() {
    const container = document.getElementById('data-container');
    container.innerHTML = '';

    manager.getObjs(0, 10).forEach(obj => {
        const item = document.createElement('div');
        item.className = 'data-item';
        item.innerHTML = `
            <h3>${obj.description}</h3>
            <p>Автор: ${obj.author}</p>
            <p>Дата создания: ${obj.createdAt.toLocaleDateString()}</p>
        `;
        container.appendChild(item);
    });
}

renderData();
