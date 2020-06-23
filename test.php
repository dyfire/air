<?php

class Arr
{
    /**
     * @param array    $array    数据
     * @param callable $callback 回调函数
     *
     * @return array
     */
    public static function walk_recursive_search(array $array, callable $callback)
    {
        $result = [];
        foreach ($array as $k => $v) {
            if (is_array($v)) {
                if ($callback($v, $k)) {
                    $result = array_merge($result, $v);
                } else {
                    $result = array_merge($result, self::walk_recursive_search($v, $callback));
                }
            }
        }

        return $result;
    }
}

$data = [
    [
        'id' => 1,
        'level' => 1,
        'name' => '11',
        'pid' => 0,
        'child' => [
            [
                'id' => 2,
                'level' => 2,
                'pid' => 1,
                'name' => '22',
                // 'child' => [
                //     [
                //         'id'    => 3,
                //         'level' => 3,
                //         'pid'   => 2,
                //         'name'  => '33'
                //     ],
                //     [
                //         'id'    => 4,
                //         'level' => 3,
                //         'pid'   => 2,
                //         'name'  => '34'
                //     ]
                // ]
            ],
            [
                'id' => 5,
                'level' => 2,
                'pid' => 1,
                'name' => '23',
                // 'child' => [
                //     [
                //         'id'    => 7,
                //         'level' => 3,
                //         'pid'   => 5,
                //         'name'  => '333'
                //     ],
                //     [
                //         'id'    => 8,
                //         'level' => 3,
                //         'pid'   => 5,
                //         'name'  => '343'
                //     ]
                // ]
            ],
        ],
    ],
    [
        'id' => 6,
        'level' => 1,
        'pid' => 0,
        'name' => '12',
    ],
];

print_r($data[0]['child']);
echo count($data[0]['child']);
exit;
$level = 2;
$pk = 1;
$data = Arr::walk_recursive_search($data, function ($val, $key) use ($level, $pk) {
    echo '--'.PHP_EOL;
    print_r($val);
    echo '---'.PHP_EOL;
    echo sprintf('%s == %s , %s === %s', $level, $val['level'], $pk, $val['pid']);
    echo PHP_EOL;
//            if ($level == $val['level'] && $pk == $val['pid']) {
//                return true;
//            } else {
//                return false;
//            }
});
