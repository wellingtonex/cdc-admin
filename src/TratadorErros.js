import PubSub from 'pubsub-js';

export default class TratadorErros {
    publicaErros(error) {
        error.errors.forEach(erro => PubSub.publish("erro-validacao",erro));
    }
}