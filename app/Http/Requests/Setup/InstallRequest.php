<?php

namespace App\Http\Requests\Setup;

use Illuminate\Foundation\Http\FormRequest;

class InstallRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'db_port'     => 'required',
            'db_host'     => 'required',
            'db_database' => 'required',
            'db_username' => 'required'
        ];
    }

    /**
     * Translate fields with user friendly name.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'db_port'     => trans('setup.install.props.db_port'),
            'db_host'     => trans('setup.install.props.db_host'),
            'db_database' => trans('setup.install.props.db_database'),
            'db_username' => trans('setup.install.props.db_username'),
        ];
    }
}
