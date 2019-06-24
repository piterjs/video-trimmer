import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
    return <div className="wrapper">
        <h1>Video trimmer</h1>
        <p>Триммер умеет шинковать ютуб-трансляции на отдельные видео.</p>
        <h2>Как резать?</h2>
        <p>Сама трансляция не порежется, увы. Всего-то лишь оттого, что ни один экстрасенс не узнает, что там внутри трансляции. Посему, нужно приложить немножко усилий и рассказать триммеру о внутренностях.</p>
        <details>
            <summary><strong>Инструкция по шинковке трансляций</strong></summary>
            <p>Чтобы порезать трансляцию на отдельные видео, тебе для начала надо зайти в раздел <Link to="/add">Slice stream</Link> (в новой вкладке!)</p>
            <p><strong>Stream title</strong>. Чтобы позже отличать эту нарезку от другой, надо её обозвать. Можно указать там название трансляции, но можно идентифицировать и как угодно иначе. Это не повлияет на нарезанные кусочки, а лишь будет отображаться <Link to="/history">в списке нарезок</Link>.</p>
            <p><strong>Stream URL</strong>. Если хочешь нарезать салатик, то режешь его. А если видео - то укажи ссылку на видео.</p>
            <p><strong>Scale</strong>. Часто при увеличении видео разница незаметна. Есть ли необходимость ухудшать качество?</p>
            <p><strong>Postroll</strong>.</p>
            <h3>Video parts</h3>
            <p>intro</p>
            <p><strong>Preroll</strong>.</p>
            <p><strong>Video start</strong>.</p>
            <p><strong>Video end</strong>.</p>
            <p><strong>Video title</strong>.</p>
            <p><strong>Description</strong>.</p>
            <p><strong>Tags</strong>.</p>
            <p><strong>Add parts</strong>.</p>
            <p><strong>Slice stream</strong>.</p>
        </details>
    </div>
};
