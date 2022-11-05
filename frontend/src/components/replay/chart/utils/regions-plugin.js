export default {
    id: 'regions',
    beforeDraw(chart, args, options) {
        if (!options?.regions || !Array.isArray(options.regions)) return;

        const {
            ctx,
            chartArea: {left, top, right, bottom},
            scales: {x, y},
        } = chart;
        const fullWidth = right - left;
        const fullHeight = bottom - top;

        let fontSize = parseInt(ctx.font, 10);
        if (isNaN(fontSize)) fontSize = 12;

        ctx.save();

        options.regions.forEach(region => {
            switch (region?.type) {
                case 'vertical':
                    if (x.min <= region.max && x.max >= region.min) {
                        const minX = Math.max(region.min, x.min);
                        const maxX = Math.min(region.max, x.max);
                        const left = x.getPixelForValue(minX);
                        const width = region.min === region.max ? 1 : x.getPixelForValue(maxX) - x.getPixelForValue(minX);

                        ctx.fillStyle = region.color;
                        ctx.fillRect(left, top, width, fullHeight);

                        if (region.label) {
                            const labelWidth = ctx.measureText(region.label)?.width ?? 0;

                            ctx.save();
                            ctx.translate(
                                region?.position?.horizontal === 'right'
                                    ? left + 2
                                    : left - (region.labelRotate? fontSize + 2 : labelWidth + 2),
                                region?.position?.vertical === 'bottom'
                                    ? y.getPixelForValue(y.min) - (region.labelRotate ? 2 : fontSize + 2)
                                    : y.getPixelForValue(y.max) + (region.labelRotate ? labelWidth : 2)
                            );
                            if (region.labelRotate) ctx.rotate(-0.5 * Math.PI);
                            ctx.textBaseline = 'top';
                            ctx.fillStyle = region.labelColor ?? region.color;
                            ctx.fillText(region.label, 0, 0);
                            ctx.restore();
                        }
                    }

                    break;

                case 'horizontal':
                default:
                    if (y.min <= region.max && y.max >= region.min) {
                        const minY = Math.max(region.min, y.min);
                        const maxY = Math.min(region.max, y.max);
                        const top = y.getPixelForValue(maxY);
                        const height = region.min === region.max ? 1 : y.getPixelForValue(minY) - y.getPixelForValue(maxY);

                        ctx.fillStyle = region.color;
                        ctx.fillRect(left, top, fullWidth, height);

                        if (region.label) {
                            const labelWidth = ctx.measureText(region.label)?.width ?? 0;

                            ctx.textBaseline = 'top';
                            ctx.fillStyle = region.labelColor ?? region.color;
                            ctx.fillText(
                                region.label,
                                region?.position?.horizontal === 'right' ? right - labelWidth - 2 : left + 2,
                                region?.position?.vertical === 'bottom' ? top + 2 : top - fontSize - 1
                            );
                        }
                    }

                    break;
            }
        });

        ctx.restore();
    },
};
